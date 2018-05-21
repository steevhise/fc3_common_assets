const Boom = require('boom');
const { PRIV_ADMIN_CONTROL_CENTER } = require('../scopes');

module.exports = {
    method: 'GET',
    path: '/pages/{pagePath*}',
    config: {
        id: 'pages_static',
        description: 'A static page stored in database. For example, try /pages/test'
    },
    handler: function (request, reply) {

        const { pageService } = request.server;

        const { pagePath } = request.params;
        const { isAuthenticated } = request.auth;

        return pageService.fetch(pagePath, { forDisplay: true })
        .then((page) => {

            if (!page) {
                return reply(Boom.notFound(`Sorry, \'${request.path}\' not found.`));
            }

            //  only control-center admins are allowed to see unpublished pages
            if (!page.published) {
                if (!isAuthenticated || !request.auth.credentials.scope.includes(PRIV_ADMIN_CONTROL_CENTER)) {
                    return reply(Boom.notFound(`Sorry, \'${request.path}\' not found.`));
                }
            }

            // Page is published, anyone can view
            reply.view('static_template', {
                title: page.title,
                data: {
                    page
                }
            });
        });
    }
};
