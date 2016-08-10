'use strict';

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
    debug: true,
    routePath: '/css/{file}.css',
    outputStyle: 'nested',
    srcExtension: 'scss'
};

//basic server
var server = new Hapi.Server({
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

// database stuff
import { graphql } from 'graphql';
import  schema  from '@freecycle/freecycle_graphql_schema';
import {Context,onLog,offLog} from '@freecycle/freecycle_node_dal';

server.decorate('server', 'context', Context);   // access via server.context
server.decorate('server', 'graphql', graphql);   // access via server.graphql
server.decorate('server', 'schema', schema);      // access via server.schema

// setup connection
server.connection({ port: process.env.PORT || 8000 });


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
        register: require('hapi-plug-routes')
    }
], function ( registerError ) {
    if ( registerError ) {
        console.error('Failed to load plugin:', registerError);
    }
    // static handlers
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
        handler: {
            directory: {
                path: './public/assets/trumbowyg',
                listing: true
            }
        }
    });


   server.views({
        engines: {
            html: Swig
        },
        context: {},
        path: path.join(__dirname, '../src/views'),
        layoutPath: path.join(__dirname, '../src/views/layout')
    });


    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});

