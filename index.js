/**
 * It's the Freecycle 3.0 static site server
 */

const Hapi = require('hapi');
const Path = require('path');
const HapiSass = require('hapi-sass');
const Inert = require('inert');
// const HapiError = require('hapi-error');

// sass config  // TODO: if we use webpack to compile our sass, we don't need this.
const sassOptions = {
    src: './build/scss',
    //includePaths: './build',
    dest: './public/assets/css',
    force: true,
    debug: true,
    routePath: '/css/{file}.css',
    outputStyle: 'nested',
    srcExtension: 'scss'
};

// basic server
const server = new Hapi.Server({
    connections: {
        router: {
            isCaseSensitive: false,
            stripTrailingSlash: false
        }
    }
});

// setup connection
server.connection({ port: process.env.PORT || 8000 });

// register plugins
server.register([
    Inert,
    {
        register: HapiSass,
        options: sassOptions
    },
    {
        register: require('vision')
    },
    {
        register: require('good'),
        options: {
            ops: {
                interval: 600000
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
        register: require('@freecycle/common-hapi-plugins/plugins/hapi-swig-extensions')
    }

], (registerError) => {

    if (registerError) {
        console.error('Failed to load plugin:', registerError);
        throw (registerError);
    }
});



            // static route handlers
server.route({
    method: 'GET',
    path: '/images/{param*}',
    config: {
        tags: ['exclude']
    },
    handler: {
        directory: {
            path: './public/assets/images/',
            listing: true
        }
    }
});
server.route({
    method: 'GET',
    path: '/font/{param*}',
    config: {
        tags: ['exclude']
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
        tags: ['js', 'exclude']
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
        tags: ['exclude', 'js']
    },
    handler: {
        directory: {
            path: './node_modules/ckeditor',
            listing: true
        }
    }
});

server.route({
  method: 'GET',
  path: '/test',
  handler:  (request,reply) => {
      console.log('test page...');
    reply.view('test', {
      title: 'test page'
    });
  }
});

server.views({
    engines: {
        html: server.plugins['hapi-swig-extensions'].swig
    },
    path: Path.join(__dirname, './src/views'),
    layoutPath: Path.join(__dirname, './src/views/layout')
});

server.start((err) => {

    if (err) {
        console.error('server startup error', err);
    }
    else {
        console.log('Server running at:', server.info.uri);
    }
});


// Export the server to be required elsewhere.
module.exports.server = server;
