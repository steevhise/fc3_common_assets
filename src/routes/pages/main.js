const Joi = require('joi');

module.exports = {
    method: '*',
    path: '/',
    config: {
        id: 'pages_home',
        description: 'Front door for logged-out users',
        validate: {
            failAction: 'ignore',
            payload: {
                latitude: Joi.number().required(),
                longitude: Joi.number().required()
            }
        },
        pre: [
            (request, reply) => {

                if (!request.payload) {
                    return reply.continue();
                }

                const { latitude, longitude } = request.payload;

                reply.state('location', {
                    latitude,
                    longitude
                });

                return reply.continue();
            }
        ]
    },
    handler: function (request, reply) {

        const { postService, groupService, siteService } = request.server;
        const location = request.state.location || request.payload;

        return groupService.fetchFeatured(location)
        .then((groups) => {

            const groupIds = !!groups.length && groups.map(({ id }) => id);

            return Promise.all([
                groups,
                postService.fetchFeatured(groupIds, 3),
                siteService.fetchStatistics()
            ]);
        })
        .then(([groups, posts, statistics]) => {

            return reply.view('home', {
                title: 'Freecycle',
                data: {
                    groups,
                    posts,
                    statistics,
                    hasLocation: !!location
                }
            });
        });
    }
};
