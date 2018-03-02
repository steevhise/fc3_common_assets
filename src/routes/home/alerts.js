const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/home/alerts',
    config: {
        id: 'home_alerts',
        description: 'The logged in user\'s alerts page.',
        auth:  { mode: 'required' }
    },
    handler: function (request, reply) {

        reply.view('home/alerts', {
            title: 'Alerts',
            posts: Mocks.posts,
            alerts,
            inBodyAds: [
                'one', 'two'
            ]
        });
    }
};

const alerts = [
    {
        alert_name: 'furniture',
        alert_time: '2 hours ago',
        alert_results: [
            {
                post_subject: 'Sofa Loveseat',
                group: { group_name: 'Tucson, AZ' },
                post_date: 'Sat Sept 9 2017 02:15:00 GMT',
                postType: { post_type_name: 'WANTED' },
                image: 'http://lorempixel.com/350/150/nightlife',
                post_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
            },
            {
                post_subject: 'Computer Desk',
                group: { group_name: 'Tucson, AZ' },
                post_date: 'Sat Sept 9 2017 02:15:00 GMT',
                postType: { post_type_name: 'WANTED' },
                image: 'http://lorempixel.com/350/150/city',
                post_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
            },
            {
                post_subject: 'Twin Bed Mattress',
                location: 'Tucson, AZ',
                group: { group_name: 'Tucson, AZ' },
                post_date: 'Tue Sept 5 2017 02:15:00 GMT',
                category: 'offer',
                postType: { post_type_name: 'OFFER' },
                image: 'http://lorempixel.com/350/400/food',
                post_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
            }
        ]
    },
    {
        alert_name: 'dresser',
        alert_time: '2 days ago',
        alert_results: []
    },
    {
        alert_name: 'computer',
        alert_time: '3 weeks ago',
        alert_results: [
            {
                post_subject: 'Computer Monitor',
                location: 'Tucson, AZ',
                group: { group_name: 'Patagonia, AZ' },
                post_date: 'Sun Sept 3 2017 02:15:00 GMT',
                category: 'borrow',
                postType: { post_type_name: 'BORROW' },
                image: 'http://lorempixel.com/350/500/city',
                post_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
            }
        ]
    },
    {
        alert_name: 'headphones',
        alert_time: '2 months ago',
        alert_results: []
    }
];
