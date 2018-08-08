
const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/town/{id}/join',
    config: {
        id: 'town-join-action',
        description: 'Endpoint that allows the current user to join a town',
        tags: ['exclude'],
        auth: { mode: 'required' },
        validate: {
            params: {
                id: Joi.number().integer().required()
            }
        },
        pre: [
            {
                assign: 'hasFriends',
                method: (request, reply) => {

                    const { id: userId } = request.auth.credentials;
                    return request.server.userService.fetchFriendships(userId)
                    .then((friendIds) => reply(!!friendIds.length));
                }
            }
        ]
    },
    handler: (request, reply) => {

        const { groupService } = request.server;
        const userId = request.auth.credentials.id;
        const groupId = request.params.id;

        return groupService.join(userId, groupId)
        .then((result) => {

            if (result.firstGroup) {
                // when a user joins their first group
                // redirect to my-towns so they see the Add Friends CTAs
                // anchors to the start your Friends Circle CTA at the bottom of the page
                return reply.redirect('/home/my-towns#first-group').temporary();
            }

            if (!request.pre.hasFriends) {
                return reply.redirect('/home/my-friends/find').temporary();
            }

            return reply.redirect('/home/my-towns').temporary();
        })
        .catch((err) => {

            if (err instanceof groupService.MembershipActionError) {

                reply.state('redirectedError', {
                    message: err.message,
                    path: request.route.path.replace('{id}', groupId),
                    type: 'membershipActionFailed'
                });

                return reply.redirect('/find-towns').temporary();
            }

            return reply(err);
        });
    }
};
