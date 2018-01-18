/**
 * It's the Freecycle 3.0 main web application! w00t!  hurrah!
 */

const Hapi = require('hapi');
const Path = require('path');
const HapiSass = require('hapi-sass');
const Inert = require('inert');
const HapiError = require('hapi-error');
const Oppsy = require('oppsy');

// sass config
const sassOptions = {
    src: './build/scss',
    includePaths: './src/assets/scss',
    dest: './public/assets/css',
    force: true,
    debug: true,
    routePath: '/css/{file}.css',
    outputStyle: 'nested',
    srcExtension: 'scss'
};

// database stuff
import { graphql } from 'graphql';
import schema from '@freecycle/freecycle_graphql_schema';
import { Context, Config } from '@freecycle/freecycle_node_dal';

const redisConfig = Config.sequelizeDbConfig.redis;

// basic server
const server = new Hapi.Server({
/*    cache: {
        engine: require('catbox-memory'),
        name: 'freecycleMain',
        partition: 'freecycle-app'
    },*/
    cache: {
        engine: require('catbox-redis'),
        host: redisConfig.host || 'localhost',
        // can also take port, password
        // database: '0',
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

// opps data collection
const oppsy = new Oppsy(server);

// collecting that data with StatsD..
const hapiStatsdConfig = {
    // prefix: 'dev',
    host: server.info.host
};

// TODO: this is still yet to be ported to hapi 17
server.register({ register: require('hapi-statsd'), options: hapiStatsdConfig }, (err) => {

    if (err) {
        console.log('error', 'Failed loading plugin: hapi-statsd');
    }
});

oppsy.on('ops', (data) => {

    // console.log(data.osload[0]);  // or whatever.
    // console.log(data.psmem);
    // console.log(data.psup);
    // send to StatsD  - add whatever else we want.
    server.statsd.gauge('system.cpu.load', data.osload[0]);
    server.statsd.gauge('psmem.heapUsed', data.psmem.heapUsed);
});

// TODO: use this to catch PM2 restart signals:  https://github.com/roylines/hapi-graceful-pm2


// decorate the server with the data layer stuff we imported above
server.decorate('server', 'context', Context);   // access via server.context
server.decorate('server', 'graphql', graphql);   // access via server.graphql
server.decorate('server', 'schema', schema);      // access via server.schema

// our object stuff. is this the best way?
import { postClassFunc } from '@freecycle/common-hapi-plugins/lib/freecycle-post';
import { userClassFunc } from  '@freecycle/common-hapi-plugins/lib/freecycle-user';

const Post = postClassFunc(server);
const User = userClassFunc(server);
server.decorate('server', 'Post', Post);        // access via server.Post
server.decorate('server', 'User', User);        // access via server.User

// extra logging, too raw though and redundant with the Good logging.
/* server.on('request', (request, event, tags) => {
    console.log(event);
}); */

// register plugins
server.register([
    Inert,
    {
        register: HapiError,                // TODO: not ported to hapi 17
        config: { statusCodes: {
            499: { message: 'Please Login to view that page' }
        } }
    },
    {
        register: HapiSass,         // TODO: not ported to hapi 17
        options: sassOptions
    },
    {
        register: require('vision')     // ported.
    },
  /*  {
        register: require('crumb'),                  // security against CRSF attacks.
        options: {
            cookieOptions: {            // TODO: this broke, maybe bug in Crumb?
                isSecure: false,
                isHttpOnly: true
            }
        }
    },*/
    {
        register: require('good'),          // TODO: still not ported to hapi 17
        options: {
            ops: {
                interval: 60000
            },
            reporters: {
                myConsoleReporter:
                [{
                    module: 'good-console',
                    args:
                    [{ format: 'YYYY-MM-DD/HH:mm:ssZ', utc: false },
           { log: '*', response: '*', server: '*', request: '*', ops: 'none' }
                    ]
                }, 'stdout'
                ]
            }
        }
    },
    {
        register: require('@freecycle/common-hapi-plugins/plugins/hapi-swig-extensions'),
        options: {
            includeDir: Path.join(__dirname, '../build/views')      // where our common template partials and icons live
        }
    },
    {
        register: require('hapi-named-routes')   // TODO: not ported to hapi 17!
    },
    {
        register: require('@freecycle/common-hapi-plugins/plugins/auth-cookie-freecycle'),
        options: {
            redirectTo: '/login',
            redirectOnTry: false,    // if mode is 'try' on a public page, don't redirect them if they're not logged in
            clearInvalid: true,
            keepAlive: false
        }
    }

], (registerError) => {

    if (registerError) {
        console.error('Failed to load plugin:', registerError);
        throw (registerError);
    }

    server.ext('onPreAuth', (request, reply) => {

        // Bypass auth for CSS route.
        // It's a hack until we can adjust hapi-sass to create a handler-type rather than a fully-configured route.
        if (request.route.path === sassOptions.routePath) {
            request.auth.credentials = 'bypass';
        }

        return reply.continue();
    });

    // store user info that we can get to from anywhere.
    server.app.cache = server.cache({ cache: 'freecycleMain', segment: 'sessions', shared: true, expiresIn: 3 * 24 * 60 * 60 * 1000 });

    // register auth strategy now that we've loaded the auth plugin.
    server.auth.strategy('session', 'cookie', 'try', Object.assign({}, server.plugins['auth-cookie-freecycle'].strategy, {
        redirectOnTry: false
    }));

    // register even more plugins
    server.register([
        {
            register: require('@freecycle/common-hapi-plugins/plugins/freecycle-login')
        },
        {
            register: require('bell')     // new version for hapi 17 just released!
        }

    ], (registerError2) => {

        if (registerError2) {
            console.error('Failed to load more plugins:', registerError2);
            throw (registerError2);
        }

        // Declare an authentication strategy using the bell scheme for Facebook login
        // with the name of the provider, cookie encryption password,
        // and the OAuth client credentials.
        server.auth.strategy('facebook', 'bell', false, {
            provider: 'facebook',
            password: 'abscdfvhgnjtrueyfhdmjkrutifhdjr4',  // whatever
            clientId: '117834011565165',
            clientSecret: 'fa596fcabbeb2651544ed73ea7c847e3',
            isSecure: false,     // Terrible idea but required if not using HTTPS especially if developing locally
            providerParams: { display: 'popup' }
        });

        server.register([
            {
                // auth strategy (above) seems to need to go before routes. according to https://github.com/toymachiner62/hapi-authorization
                register: require('hapi-plug-routes'),          // TODO: not ported to hapi 17
                options: {
                    directory: '/src/routes/'    // this is the default but it's clearer to be explicit.
                }
            },
            {
                register: require('hapi-authorization'),       // TODO: not ported to hapi 17
                options: {
                    // roles: [...server.privileges.keys()]     // this will be a list of all the privilege ids, if we pre-define them.
                    roles: false   // by default no roles are required.
                }
            }
        ], (registerError3) => {

            if (registerError3) {
                console.error('Failed to load plugin:', registerError3);
                throw (registerError3);
            }

            // static route handlers
            server.route({
                method: 'GET',
                path: '/images/{param*}',
                config: {
                    tags: ['exclude'],
                    auth: false
                },
                handler: {
                    directory: {
                        path: './public/assets/images',
                        listing: true
                    }
                }
            });
            server.route({
                method: 'GET',
                path: '/font/{param*}',
                config: {
                    tags: ['exclude'],
                    auth: false
                },
                handler: {
                    directory: {
                        path: './public/assets/font',
                        listing: true
                    }
                }
            });
            server.route({
                method: 'GET',
                path: '/js/{param*}',
                config: {
                    id: 'js',
                    description: 'directory where Front-end javascript code goes',
                    tags: ['js', 'exclude'],
                    auth: false
                },
                handler: {
                    directory: {
                        path: './public/assets/js',
                        listing: true
                    }
                }
            });
            server.route({
                method: 'GET',
                path: '/ckeditor/{param*}',
                config: {
                    tags: ['exclude', 'js'],
                    auth: false
                },
                handler: {
                    directory: {
                        path: './node_modules/ckeditor',
                        listing: true
                    }
                }
            });

            // this shows up in all views.
            const defaultContext = function (request) {

                // data about current route.
                const routeData = {
                    id: request.route.settings.id,
                    auth: request.route.settings.auth
                };

                //  info about credentialed current authenticated user.
                console.log('global context', request.auth.credentials);
                return { session: request.auth.credentials, route: routeData };
            };

            server.views({
                engines: {
                    html: server.plugins['hapi-swig-extensions'].swig
                },
                isCached: false,
                context: defaultContext,
                relativeTo: Path.join(__dirname, './'),    // should be ./lib/../
                allowInsecureAccess: true,
                // Note: this below is only path for local view files. Common assets get found by custom template loader!
                path:  '../src/views',
                layoutPath: Path.join(__dirname, '../src/views/layout')
            });

            server.start((err) => {

                if (err) {
                    console.error('server startup error', err);
                }
                else {
                    console.log('Server running at:', server.info.uri);
                    console.log(server.info);
                    oppsy.start(5000);  // start collecting ops data every N seconds.
                }
            });
        });
    });
});

// Export the server to be required elsewhere.
module.exports.server = server;
