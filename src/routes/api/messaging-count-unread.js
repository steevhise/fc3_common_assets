
module.exports = {
    path: '/api/messaging/unread',
    method: 'GET',
    config: {
        description: 'Fetch the count of a user\'s unread replies',
        tags: ['api'],
        auth: { mode: 'required' }
    },
    handler: (request, reply) => {

        const { messagingService } = request.server;

        const { id: userId } = request.auth.credentials;

        return Promise.resolve()
        .then(() => messagingService.countUnreadForUser(userId))
        .then((count) => reply(count));
    }
};
