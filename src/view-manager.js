const Path = require('path');

module.exports = (server, options) => ({
    engines: {
        html: server.plugins['hapi-swig-extensions'].swig
    },
    isCached: !options.dev,       // Cache when not in development
    allowInsecureAccess: true,    // TODO should ensure this can be set to false
    // Note: this below is only path for local view files. Common assets get found by custom template loader!
    relativeTo: Path.resolve(__dirname, '..'), // Project root
    path:  'src/views',
    layoutPath: 'src/views/layout',
    context: (request) => ({
        session: request.auth.credentials,
        route: {
            id: request.route.settings.id,
            auth: request.route.settings.auth
        },
        footerMenuItems: [
            'Local Towns',
            'Merchandise',
            'Donate',
            'Privacy',
            'About',
            'Sponsors',
            'Volunteer',
            'Terms',
            'News',
            'Help',
            'Contact',
            'Wiki'
        ]
    })
});
