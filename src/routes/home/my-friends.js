
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

            // Real simple "alphanumeric sort", bic'd from MDN
            friends.sort((a, b) => {

                const nameA = a.username.toUpperCase(); // ignore upper and lowercase
                const nameB = b.username.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });

            reply.view('home/my_friends', {
                data: {
                    friends
                },
                title: 'My Friends',
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
