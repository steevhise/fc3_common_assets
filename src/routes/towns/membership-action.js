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
                    'leave',
                    'accept'
                ]),
                requiresApproval: Joi.boolean()
            },
            params: {
                id: Joi.number().integer()
            }
        }
    },
    handler: (request, reply) => {

        const { groupService } = request.server;
        const { action, requiresApproval } = request.payload;
        const userId = request.auth.credentials.id;
        const groupId = request.params.id;

        return groupService.fetchByIdentifier(groupId)
        .then((group) => {

            if (!group) {
                throw Boom.notFound('Group not found');
            }

            if (action === 'join') {
                return groupService.join(userId, groupId, requiresApproval);
            }

            if (action === 'accept') {
                return groupService.acceptInvitation(userId, groupId);
            }

            if (action === 'leave') {
                return groupService.leave(userId, groupId);
            }

            // NOTE Can we ever get here? Review, possibly remove
            throw Boom.badImplementation(`Invalid group action "${action}".`);
        })
        .then((result) => {

            return reply.redirect(request.info.referrer || '/').temporary();
        });
    }
};
