
const internals = {};

module.exports = {
    path: '/api/messaging/topics',
    method: 'GET',
    config: {
        description: 'Endpoint for retrieving all topics the logged-in user is discussing (replies)',
        tags: ['api'],
        auth: { mode: 'required' }
    },
    handler: (request, reply) => {

        const { id: userId } = request.auth.credentials;
        const { messagingService } = request.server;

        return messagingService.fetchTopics(userId).then(reply);
    }
};
