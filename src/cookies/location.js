module.exports = (server, options) => ([
    'location',
    {
        isSecure: !options.dev,
        encoding: 'iron',
        password: options.cookiePassword,
        path: '/'
    }
]);
