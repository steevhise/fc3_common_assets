const Path = require('path');
const SwigExtensions = require('@freecycle/common-hapi-plugins/modules/swig-extensions');

const commonRoot = Path.dirname(require.resolve('@freecycle/fc3_common_assets/package.json'));
const commonViews = Path.resolve(commonRoot, 'src/views');

module.exports = (server, options) => ({
    engines: {
        html: SwigExtensions.create({
            includeDir: commonViews // For rendering common partials
        })
    },
    isCached: !options.dev,         // Cache when not in development
    // Note: this below is only path for local view files. Common assets get found by custom template loader!
    relativeTo: Path.resolve(__dirname, '..'), // Project root
    path: [
        'src/views',
        commonViews                 // For rendering top-level common views
    ],
    layoutPath: 'src/views/layout',
    context: (request) => ({
        session: request.auth.credentials,
        me: request.auth.credentials && {               // Specifically for my-replies view
            id: request.auth.credentials.id,
            username: request.auth.credentials.username
        },
        isAuthenticated: request.auth.isAuthenticated,
        maintenanceMode: options.maintenanceMode,
        route: {
            id: request.route.settings.id,
            auth: request.route.settings.auth
        },
        errors: null, // Set in extensions/errors.js
        alertCount: null, // Set in extensions/alert-count.js
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
        ],
        consts: {
            friendStatuses: request.server.userService.friendStatuses
        },
        date: new Date(),
        facebook: {
            appId: options.facebook.clientId,
            // Sorry... necessary for setting Facebook's open graph tags (see views/layout/layout.html)
            contentDomain: options.dev ? 'https://staging.fc3.freecycle.org' : 'https://freecycle.org/signup'
        }
    })
});
