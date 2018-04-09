/**
 * It's the Freecycle 3.0 main web application! w00t!  hurrah!
 */

const Hapi = require('hapi');
const Oppsy = require('oppsy');             // TODO: not ported to hapi 17 yet! but in progress, apparently
// const { Config } = require('@freecycle/freecycle_node_dal');
const { Config } = require('@freecycle/freecycle_node_dal');

exports.deployment = (start) => {

    const configPath = `${__dirname}/config.json`;
    const legacyConfigPath = `${__dirname}/config.xml`;
    const { sequelizeDbConfig } = Config.create(configPath, legacyConfigPath);

    // basic server
    const server = new Hapi.Server({
        debug: {
            log: ['error'],
            request: ['error']
        },
        cache: {         // TODO: can we test for presence of Redis server first and give a more kind error before server start?
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
                cookiePassword: 'abscdfvhgnjtrueyfhdmjkrutifhdjr4',
                facebook: {
                    clientId: '117834011565165',
                    clientSecret: 'fa596fcabbeb2651544ed73ea7c847e3'
                }
            }
        },
        {
            register: require('hapi-statsd'),
            options: {
                prefix: (process.env.NODE_ENV !== 'production') ? 'dev' : null,
                host: server.info.host
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
            throw 'Server init failed: Must have local Redis server running on port 6379!';
        }
        throw err;   // something else went wrong.
    })
    .then(() => {

        if (!start) {
            return server;
        }

        // Send ops data from oppsy to statsd

        const oppsy = new Oppsy(server);

        oppsy.on('ops', (data) => {

            server.statsd.gauge('system.cpu.load', data.osload[0]);
            server.statsd.gauge('psmem.heapUsed', data.psmem.heapUsed);
        });

        oppsy.start(5000);

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
