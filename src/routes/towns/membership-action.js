const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/town/{id}/membership',
    config: {
        id: 'town-membership-action',
        description: 'Allows the current user to take action on their membership with a town',
        auth: { mode: 'required' },
        validate: {
            payload: {
                action: Joi.string().lowercase().required().valid([
                    'join',
                    'leave'
                ])
            }
        }
    },
    handler: (request, reply) => {

        const { userService } = request.server;
        const { id } = request.params;  // group_id
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
};
