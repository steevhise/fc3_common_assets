const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/home',
    config: {
        id: 'pages_home',
        description: 'Front Door for logged-out users'
    },
    handler: function (request, reply) {

        const localGroups = [
            'Tuscon', 'Marana', 'Oro Valley', 'Vail', 'Sanuarita'
        ];
        const metrics = [
            {
                name: 'Members',
                count: '9,073,808'
            },
            {
                name: 'Local Towns',
                count: '5,270'
            },
            {
                name: 'Scams or Cost',
                count: '0'
            }
        ];

        reply.view('home', {
            title: 'Freecycle',
            posts: Mocks.posts.slice(0, 3),
            groups: localGroups,
            metrics
        });
    }
};
