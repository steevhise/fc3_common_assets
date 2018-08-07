
module.exports = {
    method: 'GET',
    path: '/api/friends',
    config: {
        description: 'Get the logged in user\'s friends',
        tags: ['api'],
        auth: {
            mode: 'required'
        }
    },
    handler: (request, reply) => {

        const { userService } = request.server;
        const { id: userId } = request.auth.credentials;

        return userService.fetchFriends(userId)
        .then((friends) => reply({ friends }));
    }
};
