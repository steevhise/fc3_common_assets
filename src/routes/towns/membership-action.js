const Boom = require('boom');
const Joi = require('joi');

const internals = {};

// These must correspond exactly to method names on the group service
internals.validMembershipActions = [
    'join',
    'leave',
    'acceptInvitation'
];

module.exports = {
    method: 'POST',
    path: '/town/{id}/membership',
    config: {
        id: 'town-membership-action',
        description: 'Allows the current user to take action on their membership with a town',
        auth: { mode: 'required' },
        validate: {
            payload: {
                action: Joi.string().lowercase().required().valid(internals.validMembershipActions)
            },
            params: {
                id: Joi.number().integer()
            }
        }
    },
    handler: (request, reply) => {

        const { groupService } = request.server;
        const { action } = request.payload;
        const userId = request.auth.credentials.id;
        const groupId = request.params.id;

        if (!internals.validMembershipActions.includes(action)) {
            // We get here only if something really bad happens i.e. a bug, so we want things to explode
            throw Boom.badImplementation(`Invalid group action "${action}".`);
        }

        return groupService[action](userId, groupId)
        .then((result) => {

            return reply.redirect(request.info.referrer || '/').temporary();
        })
        .catch((err) => {

            if (err instanceof groupService.MembershipActionError) {

                reply.state('redirectedError', {
                    message: err.message,
                    path: request.route.path.replace('{id}', groupId),
                    type: 'membershipActionFailed'
                });

                return reply.redirect(request.info.referrer || '/').temporary();
            }

            return reply(err);
        });
    }
};
