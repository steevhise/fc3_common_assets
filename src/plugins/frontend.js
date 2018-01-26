const Path = require('path');

// Build absolute path relative to project
const rel = (path) => Path.resolve(__dirname, '../../', path);

module.exports = [
    require('inert'),
    require('vision'),
    require('hapi-named-routes'),
    {
        register: require('hapi-sass'),         // TODO: not ported to hapi 17 - replacing with webpack config
        options: {
            src: rel('build/scss'),
            includePaths: rel('src/assets/scss'),
            dest: rel('public/assets/css'),
            force: true,
            debug: true,
            routePath: '/css/{file}.css',
            outputStyle: 'nested',
            srcExtension: 'scss'
        }
    },
    {
        // TODO: this should be turned into regular module with function that returns the swig object instead of server.exposing it.
        register: require('@freecycle/common-hapi-plugins/plugins/hapi-swig-extensions'),
        options: {
            includeDir: rel('build/views')
        }
    }
];
