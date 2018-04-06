module.exports = (server, options) => ([
    'redirectedError',
    {
        isSameSite: 'Lax',
        isHttpOnly: true,
        isSecure: false,
        encoding: 'base64json',
        clearInvalid: false, // remove invalid cookies
        strictHeader: false,
        path: '/'
    }
]);
