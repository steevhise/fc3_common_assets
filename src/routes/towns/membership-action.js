const Boom = require('boom');
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
            },
            params: {
                id: Joi.number().integer()
            }
        }
    },
    handler: (request, reply) => {

        const { groupService } = request.server;
        const { id } = request.params;  // Group.group_id
        const { action } = request.payload;
        const { credentials } = request.auth;

        return groupService.fetchByIdentifier(id)
        .then((group) => {

            if (!group) {
                throw Boom.notFound('Group not found');
            }

            // see GroupMembership model
            const membership = {
                user_id: credentials.id,
                group_id: id
            };

            if (action === 'join') {
                return groupService.join(membership);
            }

            if (action === 'leave') {
                return groupService.leave(membership);
            }

            // NOTE Can we ever get here? Review, possibly remove
            throw Boom.badImplementation(`Invalid group action "${action}".`);
        })
        .then((result) => {

            return reply.redirect(request.info.referrer || '/').temporary();
        });
    }
};
