module.exports = (server, options) => {

    return ['redirect', {
        path: '/',
        encoding: 'form',       // Value { to: '/some/url' } encoded like a form (i.e. like query params)
        ttl: 1000 * 60 * 5,     // 5 minutes
        isHttpOnly: true,       // Only the server can use this cookie
        isSameSite: 'Strict',   // If a user links into the site, the cookie is not sent
        isSecure: !options.dev, // Require secure cookie on production
        ignoreErrors: true,
        clearInvalid: true
    }];
};
