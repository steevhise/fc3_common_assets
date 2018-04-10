const Boom = require('boom');
const Hoek = require('hoek');
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
                ]),
                requiresApproval: Joi.boolean()
            },
            params: {
                id: Joi.number().integer()
            }
        }
    },
    handler: (request, reply) => {

        const { groupService, userService } = request.server;
        const { id } = request.params;  // Group.group_id
        const { action, requiresApproval } = request.payload;
        const { credentials } = request.auth;

        return groupService.fetchByIdentifier(id)
        .then((group) => {

            if (!group) {
                throw Boom.notFound('Group not found');
            }

            const baseData = {
                user_id: credentials.id,
                group_id: id
            };

            if (action === 'join') {
                // see GroupMembership model
                const membership = Hoek.merge({ is_pending: requiresApproval ? 1 : 0 }, baseData);
                return userService.fetchTownMemberships(credentials.id)
                    .then((memberships) => {

                        console.log(memberships.length);
                        return groupService.join(membership, memberships.length);
                    });
            }

            if (action === 'leave') {
                return groupService.leave(baseData);
            }

            // NOTE Can we ever get here? Review, possibly remove
            throw Boom.badImplementation(`Invalid group action "${action}".`);
        })
        .then((result) => {

            return reply.redirect(request.info.referrer || '/').temporary();
        });
    }
};
