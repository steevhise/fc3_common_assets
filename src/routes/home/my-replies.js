const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/home/my-replies',
    config: {
        id: 'home_myreplies',
        description: 'The logged in user\'s replies list.',
        auth:  { mode: 'required' }
    },
    handler: function (request, reply) {

        const { messagingService } = request.server;
        const { id: userId } = request.auth.credentials;

        return messagingService._cachedUnreadForUser.cache.drop(userId)
        .then(() => reply.view('home/my_replies'));
    }
};
