const Boom = require('boom');
const Constants = require('@freecycle/common-hapi-plugins/constants');
const Joi = require('joi');

module.exports = [{
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
            // viewerId is either false OR id of currently logged in user
            viewerId: isAuthenticated && credentials.id,
            where: {
                username
            }
        })
        .then((profile) => {

            if (!profile) {
                throw Boom.notFound('User not found');
            }

            profile.groups = profile.groups.map(({ group }) => group);

            // Don't publicize groups in region 32
            if (!isAuthenticated || credentials.id !== profile.id) {
                profile.groups = profile.groups.filter((group) => group.region.id !== Constants.SEMI_PRIVATE_REGION);
            }

            return reply.view('user', {
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
},
{
    method: 'POST',
    path: '/user/{identifier}/friendship',
    config: {
        id: 'user-friendship-action',
        description: 'An endpoint for the current user to take action on their friendship with another user.',
        tags: ['exclude'],
        auth: { mode: 'required' },
        validate: {
            payload: {
                action: Joi.string().lowercase().required().valid([
                    'friend',
                    'accept',
                    'unfriend',
                    'reject',
                    'block',
                    'unblock'
                ])
            }
        }
    },
    handler: (request, reply) => {

        const { userService } = request.server;
        const { identifier } = request.params;  // Username, id, or email address
        const { action } = request.payload;
        const { isAuthenticated, credentials } = request.auth;

        return userService.fetchByIdentifier(identifier, 'id: user_id')
        .then((user) => {

            if (!user) {
                throw Boom.notFound('User not found');
            }

            const friendship = {
                friender: credentials.id,
                friendee: user.id
            };

            if (action === 'friend' || action === 'accept') {
                return userService.friend(friendship);
            }

            if (action === 'unfriend' || action === 'reject') {
                return userService.unfriend(friendship);
            }

            if (action === 'block') {
                return userService.block(friendship);
            }

            if (action === 'unblock') {
                return userService.unblock(friendship);
            }

            throw Boom.badImplementation(`Invalid friend action "${action}".`);
        })
        .then(() => {

            return reply.redirect(request.info.referrer || '/').temporary();
        });
    }
}];
