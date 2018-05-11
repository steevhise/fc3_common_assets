module.exports = (server, options) => ([
    'alertCount',
    {
        isSameSite: 'Lax',
        isSecure: !options.dev,
        clearInvalid: false,
        strictHeader: false,
        path: '/'
    }
]);
