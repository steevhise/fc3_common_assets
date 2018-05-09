module.exports = (server, options) => ([
    'startATown',
    {
        isSameSite: 'Lax',
        isHttpOnly: true,
        isSecure: !options.dev,
        encoding: 'base64json',
        clearInvalid: false,
        strictHeader: false,
        path: '/'
    }
]);
