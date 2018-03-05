const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/user/{username}',
    config: {
        id: 'user',
        description: 'The user\'s profile, viewed by others.'
    },
    handler: function (request, reply) {

        const inBodyAds = [
            'one',
            'two'
        ];

        const user = {
            avatar_url: 'http://lorempixel.com/150/150/people/8',
            name: 'Nathan Puente',
            username: 'npuente',
            description: 'I\'m a business-owener and entrepreneur in Tuscon.',
            thumbsup: 100,
            groups: [
                {
                    name: 'Tucson',
                    state: 'AZ'
                },
                {
                    name: 'Marana',
                    state: 'AZ'
                },
                {
                    name: 'Vail',
                    state: 'AZ'
                },
                {
                    name: 'Oro Valley',
                    state: 'AZ'
                }
            ]
        };

        console.log('!!!!auth mode: ' + request.auth.mode);
        //console.log(request.route.settings);
        reply.view('user', {
            user,
            showFilterSelectors: false,
            filterType: 'circle',
            inBodyAds,
            title: 'User Profile',
            posts: Mocks.posts
        });
    }
};
