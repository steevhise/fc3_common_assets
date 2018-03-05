const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/home/dashboard',
    config: {
        description: 'The logged-in user\'s \'home\'.',
        id: 'home_dashboard',
        auth: { mode: 'required' }
    },
    handler: function (request, reply) {

        reply.view('desktop_dash', {
            messageSets: [
                {
                    messageHeader: 'My Replies',
                    messages: [
                        {
                            title: 'Kid Clothes',
                            image: 'http://lorempixel.com/250/250',
                            category: 'offer',
                            type: 'Reply',
                            time: '10 Minutes Ago',
                            id: 1
                        },
                        {
                            title: 'Acrylic Paints',
                            image: 'http://lorempixel.com/250/250',
                            category: 'offer',
                            type: 'Reply',
                            time: '15 Minutes Ago',
                            id: 2
                        }
                    ]
                },
                {
                    messageHeader: 'Replies to My Posts',
                    messages: [
                        {
                            title: 'Vaccum Cleaner with a very long title',
                            category: 'wanted',
                            image: 'http://lorempixel.com/250/250',
                            type: 'PostReply',
                            time: '15 Minutes Ago',
                            notification: '7 unread replies',
                            id: 3
                        },
                        {
                            title: 'Canon 560 Printer',
                            category: 'lend',
                            image: 'http://lorempixel.com/250/250',
                            type: 'PostReply',
                            time: '15 Minutes Ago',
                            notification: '15 unread replies',
                            id: 5
                        },
                        {
                            title: 'Patio Furniture',
                            category: 'offer',
                            image: 'http://lorempixel.com/250/250',
                            type: 'PostReply',
                            time: '15 Minutes Ago',
                            notification: '1 unread reply',
                            id: 6
                        }
                    ]
                },
                {
                    messageHeader: 'Chat With Friends',
                    messages: [
                        {
                            title: 'Deron Beal',
                            image: 'http://lorempixel.com/250/250',
                            type: 'ChatMessage',
                            time: '1 Week Ago',
                            id: 7
                        },
                        {
                            title: 'Steev Hise',
                            image: 'http://lorempixel.com/250/250',
                            type: 'ChatMessage',
                            time: '2 Weeks Ago',
                            id: 8
                        }
                    ]
                }
            ],
            showFilterSelectors: true,
            showDashboard: true,
            filterType: 'circle',
            friends: Mocks.friends,
            title: 'Desktop Dash',
            posts: Mocks.posts,
            inBodyAds: [
                'one',
                'two'
            ]
        });
    }
};
