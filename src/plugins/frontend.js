const Path = require('path');

module.exports = () => ([
    require('inert'),
    require('vision'),
    require('hapi-named-routes')
]);
