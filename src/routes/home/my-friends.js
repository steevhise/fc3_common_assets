const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/home/my-friends',
    config: {
        id: 'home_myfriends',
        description: 'The logged in user\'s friends list.',
        auth:  { mode: 'required' }
    },
    handler: function (request, reply) {

        const inBodyAds = [
            'one',
            'two'
        ];
        reply.view('./home/my_friends', {
            messageSets: [
                {
                    messageHeader: 'Chat With Friends',
                    messages: [
                        {
                            title: 'Deron Beal',
                            image: 'http://lorempixel.com/250/250',
                            type: 'ChatMessage',
                            time: '5 minutes ago',
                            id: 7
                        },
                        {
                            title: 'Steev Hise',
                            image: 'http://lorempixel.com/250/250',
                            type: 'ChatMessage',
                            time: '3 weeks ago',
                            id: 8
                        }
                    ]
                }
            ],
            showFilterSelectors: true,
            filterType: 'circle',
            friends: Mocks.friends,
            inBodyAds,
            title: 'My Friends',
            posts: Mocks.posts
        });
    }
};
