const Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/user/{username}',
    config: {
        id: 'user',
        description: 'The user\'s profile, viewed by others.'
    },
    handler: function (request, reply) {

        const { userService } = request.server;
        const { username } = request.params;
        const { credentials, isAuthenticated } = request.auth;

        return userService.fetchProfile({
            viewerId: isAuthenticated && credentials.id,
            where: {
                username
            }
        })
        .then((profile) => {

            if (!profile) {
                throw Boom.notFound('User not found');
            }

            return reply({
                title: 'User Profile',
                showFilterSelectors: false,
                filterType: 'circle',
                inBodyAds: [
                    'one',
                    'two'
                ],
                data: {
                    profile
                }
            });
        });
    }
};
