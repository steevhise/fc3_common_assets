'use strict';

var Boom = require('boom');
var Hapi = require('hapi');
var path = require('path');
var HapiSass = require('hapi-sass');
var Inert = require('inert');
var HapiError = require('hapi-error');
var Swig = require('swig-templates');

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

// Export the server to be required elsewhere.  TODO: does this do any good?
module.exports = server;

// database stuff
import { graphql } from 'graphql';
import  schema  from '@freecycle/freecycle_graphql_schema';
import {Context,onLog,offLog} from '@freecycle/freecycle_node_dal';

server.decorate('server', 'context', Context);   // access via server.context
server.decorate('server', 'graphql', graphql);   // access via server.graphql
server.decorate('server', 'schema', schema);      // access via server.schema

// setup connection
server.connection({ port: process.env.PORT || 8000 });

server.on('request', (request, event, tags) => {
    console.log(event);
});


// register plugins
server.register([Inert,
    {
        register: HapiSass,
        options: sassOptions
    },
    {
        register: HapiError
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
        register: require("hapi-named-routes"),
    },
    {
        register: require('@freecycle/common-hapi-plugins/freecycle-login')
    },
    {
        register: require("@freecycle/common-hapi-plugins/auth-cookie-freecycle"),
        options: {
            redirectTo: false,    // for this site, we don't want to make people login, right?
            auth: false,
            // mode: 'try'   ??
        }
    },

], function ( registerError ) {
    if (registerError) {
        console.error('Failed to load plugin:', registerError);
        throw(registerError);
    }

    // store user info that we can get to from anywhere.
    server.app.cache = server.cache({segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000});

    // prepare for auth stuff now that we've loaded the auth  plugin.
    server.auth.strategy('session', 'cookie', true, server.plugins['auth-cookie-freecycle']['strategy']);

    server.register({
        register: require('hapi-authorization'),
        options: {
            // roles: [...server.privileges.keys()]     // this will be a list of all the privilege ids, if we pre-define them.
            roles: false   // by default no roles are required.
        }
    }, function (registerError) {
        if (registerError) {
            console.error('Failed to load plugin:', registerError);
            throw(registerError);
        }

        server.log('info', 'loading  routes');

        server.register({
            register: require('hapi-plug-routes')
        }, function (registerError) {
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
                    tags: ['js'],
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
                context: {},
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

