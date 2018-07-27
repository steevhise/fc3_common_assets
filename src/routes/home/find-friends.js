
const Hoek = require('hoek');
const Wreck = require('wreck');

const internals = {};

module.exports = {
    method: 'GET',
    path: '/home/my-friends/find',
    config: {
        id: 'home_invitefriends',
        description: 'Find new friends (invite from Facebook or email, add existing Facebook friends who also use FC)',
        auth:  { mode: 'required' }
    },
    handler: function (request, reply) {

        const { id: userId } = request.auth.credentials;
        const { userService } = request.server;
        const { clientId, clientSecret } = request.server.registrations.fc3_main.options.facebook;

        return userService.fetchFacebookUser(userId)
        // Graph API version is set in our app's FB developers dashboard: Settings > Advanced > Upgrade API version
        // Alternatively, we can specify the version in the first path segment of the url as /v3.0/...
        .then(({ facebookId }) => Wreck.get(`https://graph.facebook.com/${facebookId}/friends?access_token=${clientId}|${clientSecret}`))
        .then(({ res, payload }) => {

            const { data: friends } = JSON.parse(payload.toString());

            if (!friends.length) {
                return;
            }

            // If user deauthorizes FC directly, but not here....
            // then they won't be returned in the above call, so won't be considered in the confirmedUsers list below
            return Promise.all([
                // Confirm that Facebook users retrieved are registered on FC (hopefully edge-casey, but to be absolutely sure)
                userService.fetchFacebookUsers(friends.map((({ id: facebookId }) => facebookId ))),
                userService.fetchFriendships(userId, true), // Add includeRequests flag, so we DON'T include pending or waiting in our final display
                friends
            ])
            .then(([confirmedUsers, friendships, friends]) => confirmedUsers
                .filter((u) => !friendships.includes(u.id))
                .map(({ facebookId, ...rest }) => ({ ...rest, facebookId, facebookUsername: internals.username(facebookId, friends) }))
            );
        })
        .then((facebookFriends) => {

            return reply.view('home/find_friends', {
                data: {
                    facebookFriends
                },
                title: 'Find Friends',
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        })
        .catch((err) => {

            // user isn't connected to Facebook
            // we still load the page, just without the Find Facebook friends feature displayed
            const wreckError = Hoek.reach(err, 'data.isResponseError');
            if (err instanceof userService.UserDoesNotExistError || wreckError) {

                if (wreckError) {
                    console.warn('**WARNING** Wreck request failed. Could be either a bug (app permissions or invalid facebook id data on our end) or just expected behavior (e.g user manually revoked FC permission to read its data (or they expired))');
                }

                return reply.view('home/find_friends', {
                    data: {},
                    title: 'Find Friends',
                    inBodyAds: [
                        'one',
                        'two'
                    ]
                });
            }

            throw err;
        });
    }
};

internals.username = (facebookId, facebookFriends) => {

    // Ensures we don't depend on the name value existing in Facebook's data
    // to get through our handler and display the view
    try {
        // ids in objects from Facebook are received as strings
        return facebookFriends.find((f) => Number(f.id) === facebookId).name;
    } catch (e) {
        return '';
    }
};
