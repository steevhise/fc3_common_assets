const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/',
    config: {
        id: 'pages_home',
        description: 'Front door for logged-out users'
    },
    handler: function (request, reply) {

        const { postService, groupService, siteService } = request.server;

        return Promise.all([
            postService.fetchFeatured(3),
            groupService.fetchFeatured(),
            siteService.fetchStatistics()
        ])
        .then(([posts, groups, statistics]) => {

            return reply.view('home', {
                title: 'Freecycle',
                data: {
                    posts,
                    groups,
                    statistics
                }
            });
        });
    }
};
