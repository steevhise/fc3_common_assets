/**
 * It's the Freecycle 3.0 main web application! w00t!  hurrah!
 */

//  This has to be first, as explained here: https://www.elastic.co/guide/en/apm/agent/nodejs/current/hapi.html#hapi-initialization
const Apm = require('elastic-apm-node');
Apm.start();

const Hapi = require('hapi');
const { Config } = require('@freecycle/freecycle_node_dal');

exports.deployment = (start) => {

    const configPath = `${__dirname}/config.json`;
    const config = require(configPath);
    const legacyConfigPath = `${__dirname}/config.xml`;
    const { sequelizeDbConfig } = Config.create(configPath, legacyConfigPath);

    // basic server
    const server = new Hapi.Server({
        debug: {
            log: ['error'],
            request: ['error']
        },
        cache: {
            engine: require('catbox-redis'),                            // TODO catbox-memory for development
            host: sequelizeDbConfig.redis.host || 'localhost',   // TODO: should be set in app-level config
            name: 'freecycleMain',
            partition: 'freecycle-app'
        },
        connections: {
            router: {
                isCaseSensitive: false,
                stripTrailingSlash: true
            },
            routes: {
                validate: {
                    options: {
                        allowUnknown: true
                    }
                }
            }
        }
    });

    // setup connection
    server.connection({ port: process.env.PORT || 8000 });

    return server.register([
        {
            register: require('@freecycle/freecycle_graphql_schema'),
            options: {
                configPath,
                legacyConfigPath
            }
        },
        {
            register: require('.'),
            options: {
                dev: process.env.NODE_ENV !== 'production',
                maintenanceMode: config.maintenanceMode,
                cookiePassword: 'abscdfvhgnjtrueyfhdmjkrutifhdjr4',
                facebook: process.env.NODE_ENV === 'production' ? config.facebook.prod : config.facebook.test,
                imagesURL: 'https://images.freecycle.org',
                legacyConfigPath                                // this is so we can get the Gearman config not read elsewhere.
            }
        },
        {
            register: require('good'),          // TODO: still not ported to hapi 17
            options: {
                ops: {
                    interval: 60000
                },
                reporters: {
                    myConsoleReporter: [
                        {
                            module: 'good-console',
                            args: [
                                { format: 'YYYY-MM-DD/HH:mm:ssZ', utc: false },
                                { log: '*', response: '*', server: '*', request: '*', ops: 'none' }
                            ]
                        }, 'stdout'
                    ]
                }
            }
        }
    ])
    .then(() => server.initialize()) // Starts caches, checks plugin dependencies
    .catch( (err) => {

        if (err.port === 6379) {
            // This means no Redis server to connect to.
            err.message = `Server init failed: Must have local Redis server running on port 6379! ---- ${err.message}`;
            throw err.message;
        }
        else {
            throw err;   // Now whatever else it is, throw it.
        }
    })
    .then(() => {

        if (!start) {
            return server;
        }

        // we are sending ops data using Elastic APM agent.
        // attach the agent to the server here so we send custom data at will from anywhere.
        server.decorate('server', 'apm', Apm);

        return server.start()
            .then(() => console.log('Server running at:', server.info.uri))
            .then(() => server);
    });
};

// Setup and start server when not require()'d, i.e. from tests

if (!module.parent) {
    exports.deployment(true).catch((err) => {

        console.error(err);
        process.exit(1);
    });
}
