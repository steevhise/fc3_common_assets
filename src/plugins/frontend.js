const Path = require('path');

// Build absolute path relative to project
const rel = (path) => Path.resolve(__dirname, '../../', path);

module.exports = [
    require('inert'),
    require('vision'),
    require('hapi-named-routes'),
    {
        // TODO: this should be turned into regular module with function that returns the swig object instead of server.exposing it.
        register: require('@freecycle/common-hapi-plugins/plugins/hapi-swig-extensions'),
        options: {
            includeDir: rel('build/views')
        }
    }
];
