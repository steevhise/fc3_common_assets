const Path = require('path');
const SwigExtensions = require('@freecycle/common-hapi-plugins/modules/swig-extensions');

// Build absolute path relative to project
const rel = (path) => Path.resolve(__dirname, '../', path);

module.exports = (server, options) => ({
    engines: {
        html: SwigExtensions.create({
            includeDir: rel('build/views')  // For rendering common partials
        })
    },
    isCached: !options.dev,       // Cache when not in development
    allowInsecureAccess: true,    // TODO should ensure this can be set to false
    // Note: this below is only path for local view files. Common assets get found by custom template loader!
    relativeTo: Path.resolve(__dirname, '..'), // Project root
    path: [
        'src/views',
        rel('build/views')                  // For rendering top-level common views
    ],
    layoutPath: 'src/views/layout',
    context: (request) => ({
        session: request.auth.credentials,
        route: {
            id: request.route.settings.id,
            auth: request.route.settings.auth
        },
        footerMenuItems: [
            { name: 'Local Towns', path: '/' },
            { name: 'Merchandise', path: '/' },
            { name: 'Donate', path: '/' },
            { name: 'Privacy', path: '/' },
            { name: 'About', path: '/' },
            { name: 'Sponsors', path: '/' },
            { name: 'Volunteer', path: '/' },
            { name: 'Terms', path: '/' },
            { name: 'News', path: '/' },
            { name: 'Help', path: '/' },
            { name: 'Contact', path: '/' },
            { name: 'Wiki', path: '/' }
        ]
    })
});
