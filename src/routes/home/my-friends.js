
module.exports = {
    method: 'GET',
    path: '/home/my-friends',
    config: {
        id: 'home_myfriends',
        description: 'The logged in user\'s friends list.',
        auth:  { mode: 'required' }
    },
    handler: function (request, reply) {

        const { id: userId } = request.auth.credentials;
        const { userService } = request.server;

        return userService.fetchFriends(userId)
        .then((friends) => {

            reply.view('home/my_friends', {
                data: {
                    friends
                },
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
