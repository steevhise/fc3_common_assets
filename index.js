'use strict';

var Hapi = require('hapi');
var path = require('path');
var HapiSass = require('hapi-sass');
var Inert = require('inert');
var HapiError = require('hapi-error');
var Swig = require('swig');

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
                path: 'public/assets/images',
                listing: true
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/fonts/{param*}',
        handler: {
            directory: {
                path: 'public/assets/fonts',
                listing: true
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/js/{param*}',
        handler: {
            directory: {
                path: 'public/assets/js',
                listing: true
            }
        }
    });


   server.views({
        engines: {
            html: Swig
        },
        context: {},
        path: path.join(__dirname, '/src/views'),
        layoutPath: path.join(__dirname, '/src/views/layout')
    });


    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});

