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
        route: {
            id: request.route.settings.id,
            auth: request.route.settings.auth
        },
        errors: []
            .concat(request.response.source.context.errors || [])
            .concat(request.app.formValidation || []),
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
        }
    })
});