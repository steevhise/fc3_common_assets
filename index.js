'use strict';

var Boom = require('boom');
var Hapi = require('hapi');
var path = require('path');
var HapiSass = require('hapi-sass');
var Inert = require('inert');
var HapiError = require('hapi-error');
var Swig = require('swig-templates');
var moment = require('moment');

var longjohn = require('longjohn');     // only for development!!  (stack traces)

// swig filters
Swig.setFilter('mdate', function(date,format) {
    return moment().format(format);
});
Swig.setFilter('mreldate', function(date) {
    return moment(date).fromNow();
});

// sass config
var sassOptions = {
    src: './src/assets/scss',
    dest: './public/assets/css',
    force: true,
    debug: false,
    routePath: '/css/{file}.css',
    outputStyle: 'nested',
    srcExtension: 'scss',
};

//basic server
var server = new Hapi.Server({
    cache: {
        engine: require('catbox-memory'),
        name: 'catmem',
        segment: 'auth'
    },
    connections: {
        router: {
            isCaseSensitive: false,
            stripTrailingSlash: true
        },
        routes: {
            auth: false,    // default to no auth needed anywhere.
            validate: {
                options: {
                    allowUnknown: true
                }
            }
        }
    }
});

// database stuff
import { graphql } from 'graphql';
import  schema  from '@freecycle/freecycle_graphql_schema';
import {Context,onLog,offLog} from '@freecycle/freecycle_node_dal';

server.decorate('server', 'context', Context);   // access via server.context
server.decorate('server', 'graphql', graphql);   // access via server.graphql
server.decorate('server', 'schema', schema);      // access via server.schema

// our object stuff. is this the best way?
import { postClassFunc } from "@freecycle/common-hapi-plugins/lib/freecycle-post";

const Post = postClassFunc(server);
server.decorate('server', 'Post', Post);        // access via server.Post

// setup connection
server.connection({ port: process.env.PORT || 8000 });

// extra logging, too raw though and redundant with the Good logging.
/*server.on('request', (request, event, tags) => {
    console.log(event);
});*/


// register plugins
server.register([
    Inert,
    HapiError,
    {
        register: HapiSass,
        options: sassOptions
    },
    {
        register: require('vision')
    },
    {
        register: require('crumb')                  // security against CRSF attacks.
    },
    {
        register: require("good"),
        options: {
            ops: {
                interval: 600000
            },
            reporters: {
                myConsoleReporter: [{
                    module: 'good-console',
                    args: [{ format: 'YYYY-MM-DD/HH:mm:ssZ', utc: false},
                        {log: '*', response: '*', server: '*', request: '*', ops: 'none'}]
                }, 'stdout']
            }
        }
    },
    {
        register: require("hapi-named-routes")
    },
    {
        register: require("@freecycle/common-hapi-plugins/plugins/auth-cookie-freecycle"),
        options: {
            redirectTo: "/login",
            redirectOnTry: false,    // if mode is 'try' on a public page, don't redirect them if they're not logged in
            clearInvalid: true,
            keepAlive: false
        }
    }

], function ( registerError ) {
    if (registerError) {
        console.error('Failed to load plugin:', registerError);
        throw(registerError);
    }

    // store user info that we can get to from anywhere.
    server.app.cache = server.cache({segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000});

    // register auth strategy now that we've loaded the auth  plugin.
    server.auth.strategy('session', 'cookie', "try", server.plugins['auth-cookie-freecycle']['strategy']);
    console.log(server.plugins['auth-cookie-freecycle']['strategy']);

    // register even more plugins
    server.register([
        {
            register: require('@freecycle/common-hapi-plugins/plugins/freecycle-login')
        },
        {
            register: require('bell')
        }


    ], function ( registerError ) {
        if (registerError) {
            console.error('Failed to load more plugins:', registerError);
            throw(registerError);
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
            providerParams: { display: 'popup'}
        });

        server.register([
            {
                // auth strategy (above) seems to need to go before routes. according to https://github.com/toymachiner62/hapi-authorization
                register: require('hapi-plug-routes')
            },
            {
                register: require('hapi-authorization'),
                options: {
                    // roles: [...server.privileges.keys()]     // this will be a list of all the privilege ids, if we pre-define them.
                    roles: false   // by default no roles are required.
                }
            }
        ], function (registerError) {
            if (registerError) {
                console.error('Failed to load plugin:', registerError);
                throw(registerError);
            }

            // static route handlers
            server.route({
                method: 'GET',
                path: '/images/{param*}',
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
                path: '/trumbowyg/{param*}',
                config: {
                    tags: ['exclude', 'js'],
                },
                handler: {
                    directory: {
                        path: './public/assets/trumbowyg',
                        listing: true
                    }
                }
            });

            // this shows up in all views. right now just for info about credentialed current authenticated user.
            const defaultContext = function (request) {
                console.log('global context', request.auth.credentials);
                return {session: request.auth.credentials};
            };

            server.views({
                engines: {
                    html: Swig
                },
                context: defaultContext,
                path: path.join(__dirname, '../src/views'),
                layoutPath: path.join(__dirname, '../src/views/layout')
            });


            server.start(function (err) {
                if (err) {
                    console.error('server startup error', err);
                } else {
                    console.log('Server running at:', server.info.uri);
                }
            });
        });
    });
});

// Export the server to be required elsewhere.
module.exports.server = server;
