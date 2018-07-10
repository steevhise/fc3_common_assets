/*"data": [
{
"name": "Brs Testman",
"id": "245034932753614"
}
]*/
//  https://graph.facebook.com/v3.0/{{ facebook id }}/friends?access_token=${clientId}|${clientSecret}
// https://developers.facebook.com/tools/debug/accesstoken/

const Wreck = require('wreck');

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

        // NEED TO FETCH FACEBOOK ID OF USER

        return reply.view('home/find_friends', {
            data: {
                facebookFriends: [
                    {   // What do we need?
                        /*
                            use friend_card partial, comply w/ that interface
                            but also add FB username above
                        */
                        id: 1,
                        email: 'support@bigroomstudios.com',
                        username: 'xX_postconius_Xx',
                        image: 'https://images.freecycle.org/user/12234567845678', // default user image
                        firstName: 'Postcone',
                        lastName: 'Jones',
                        info: {
                            reputation: 1,
                            verified: true
                        },
                        facebookUsername: 'Brs Testman'
                    },
                    {
                        id: 2,
                        username: 'mlgDankNugsExpress',
                        image: 'https://images.freecycle.org/user/12234567845678', // default user image
                        firstName: 'Shrek',
                        lastName: 'SwampKing',
                        info: {
                            reputation: 0,
                            verified: true
                        },
                        facebookUsername: 'Milo Nugsberry'
                    }
                ]
            },
            title: 'Invite Friends',
            inBodyAds: [
                'one',
                'two'
            ]
        });
        /**
        return userService.fetchFacebookUser(userId)
        .then(({ facebookId }) => {

            // TODO Need to specify version?
            return Wreck.get(`https://graph.facebook.com/v3.0/${facebookId}/friends?access_token=${clientId}|${clientSecret}`);
        })
        .then(({ res, payload }) => {

            // TODO What is the shape of the payload?
            const { success } = JSON.parse(payload.toString());

            // API still returns true if no perms to delete , so this case
            // would mean issue connecting w/ FB, perms issue, etc. Something's really screwed
            if (!success) {
                throw new Error('Facebook disconnection failed');
            }


            // TODO Parse friends, ensure all returned are actually users on freecycle

        })
        .then((friends) => {

            return reply.view('home/invite_friends', {
                data: {
                    friends
                },
                title: 'Invite Friends',
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        })
        .catch((err) => {

            if (err instanceof userService.UserDoesNotExistError) {
                // What do we do here
            }
        });
        **/
    }
};
