'use strict';

const Path = require('path');

// Build absolute path relative to project
const rel = (path) => Path.resolve(__dirname, '../../', path);

module.exports = [
    require('inert'),
    require('vision'),
    require('hapi-named-routes'),               // TODO: not ported to hapi 17
    {
        register: require('hapi-sass'),         // TODO: not ported to hapi 17
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
        register: require('hapi-error'),        // TODO: not ported to hapi 17
        options: {
            statusCodes: {
                499: { message: 'Please login to view that page' }
            }
        }
    },
    {
        register: require('@freecycle/common-hapi-plugins/plugins/hapi-swig-extensions'),
        options: {
            includeDir: rel('build/views')
        }
    }
];
