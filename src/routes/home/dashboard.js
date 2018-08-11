const Joi = require('joi');

module.exports = {
    method: 'GET',
    path: '/home/dashboard',
    config: {
        description: 'The logged-in user\'s \'home\'.',
        id: 'home_dashboard',
        auth: { mode: 'required' },
        validate: {
            query: Joi.object({
                town: Joi.alternatives().try(
                    Joi.string().valid('all'),
                    Joi.number().integer()
                ).empty(''),
                friends: Joi.boolean().truthy('1', 'true').empty('')
            })
                .nand('town', 'friends'),
            // Treat invalid query as empty
            failAction: (request, reply) => {

                request.query = {};

                return reply.continue();
            }
        }
    },
    handler: function (request, reply) {

        const { postService, userService, tagService } = request.server;
        const { credentials } = request.auth;
        const { town, friends } = request.query;

        const criteria = {
            town: (town === 'all' || (!town && !friends)) ? postService.ALL_TOWNS : town,
            friends
        };

        return Promise.all([
            postService.forUser(credentials.id, criteria),
            userService.fetchTownMemberships(credentials.id),
            tagService.fetchAll()
        ])
        .then(([posts, towns, tags]) => {

            reply.view('desktop_dash', {
                title: 'Dashboard',
                data: {
                    posts,
                    tags,
                    towns,
                    criteria: {
                        town: (!town && !friends) ? 'all' : town,
                        friends
                    }
                },
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
