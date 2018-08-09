const OS = require('os');

module.exports = {
    // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
    serviceName: 'TFN' + OS.type(),

    // Use if APM Server requires a token
    secretToken: '',

    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'http://pandora.freecycle.org:8200'
};
