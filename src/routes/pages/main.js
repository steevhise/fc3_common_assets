const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/',
    config: {
        id: 'pages_home',
        description: 'Front door for logged-out users'
    },
    handler: function (request, reply) {

        const { postService } = request.server;

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

        return postService.fetchFeatured(3).then((posts) => {

            return reply.view('home', {
                title: 'Freecycle',
                posts,
                groups: localGroups,
                metrics
            });
        });
    }
};
