const Joi = require('joi');
const Mocks = require('./helpers/mocks');
const RouteHelpers = require('../helpers');

const internals = {};

module.exports = {
    method: '*',
    path: '/home/alerts',
    config: ({ alertService }) => ({
        id: 'home_alerts',
        description: 'The logged in user\'s alerts page (also supports setting new alerts).',
        auth:  { mode: 'required' },
        validate: {
            failAction: RouteHelpers.formFailAction,
            payload: Joi.object({
                newAlertTags: Joi.array()
                    .single()
                    .items(Joi.number().integer().min(1))
                    .label('New Alert Tags'),
                alertIdDelete: Joi.number()
                    .integer()
                    .min(1)
                    .label('Alert To Delete')
            }).xor('newAlertTags', 'alertIdDelete')
        },
        pre: [
            (request, reply) => {

                if (request.method === 'get' || request.app.formValidation) {
                    return reply.continue();
                }

                // Route supports both deleting and creating alerts
                // Deletions still come in as POST requests; joi validation ensures post bodies of each request are mutually exclusive
                const { id: userId } = request.auth.credentials;
                const { newAlertTags, alertIdDelete } = request.payload;
                console.log('DELETING AN ALERT', alertIdDelete);
                // TODO const alertAction = newAlertTags ? alertService.create(newAlertTags, userId) :alertService.delete(alertIdDelete, userId);

                // Handle post — Create an alert with the given data and return to the page....
                return Promise.resolve()
                    //.then(() => alertAction TODO Replace with actual create method when built
                    .then(() => reply.continue())
                    .catch((err) => {

                        // TODO Update when errors returned from service layer are more defined
                        if (err) {
                            console.log(err.message);
                            throw err;
                        }
                    });
            }
        ]
    }),
    handler: function (request, reply) {

        const { alertService, postService } = request.server;
        const { id: userId } = request.auth.credentials;
        const { alertCount } = request.state;

        if (alertCount) {
            reply.unstate('alertCount');
            delete request.state.alertCount; // reply.unstate doesn't remove cookies parsed from request
            // TODO alertService.countForUser.cache.drop(userId);
            // REMEMBER: THIS IS A PROMISE!!!
        }

        return Promise.all([
            postService.fetchTags(),
            Promise.resolve(internals.alerts), // TODO alertService.forUser(userId)
            postService.forGroup(1014) // TODO Remove, just for mock data
        ])
        .then(([tags, alerts, posts]) => {

            // TODO Filter out existing alerts tags from tags passed to template (tags are used as options for new)
            const unalertedTags = tags.filter((tag) => !alerts.find((alert) => alert.tag.id === tag.id));

            /***** TODO MOCK - Remove ******/
            alerts.forEach((alert) => {

                alert.posts = posts.filter((post) => post.tags.find((tag) => tag.id === alert.tag.id));
                alert.posts.forEach((p) => {

                    p.seen = true;
                });
            });
            alerts[0].posts[0].seen = false;
            /***********/

            // Hacking newly created tags list into more grammatically presentable state for form success message :)
            let formattedSuccess;
            if (request.payload) {
                const { newAlertTags, alertIdDelete } = request.payload;
                if (newAlertTags) {
                    formattedSuccess = newAlertTags.map((nalt) => (tags.find((t) => t.id === nalt)).name);
                    if (newAlertTags.length > 1) {
                        formattedSuccess[formattedSuccess - 1] = `and ${formattedSuccess[formattedSuccess.length - 1]}`;
                    }
                    const glue = formattedSuccess.length > 2 ? ' ,' : ' ';
                    formattedSuccess = `You will now receive alerts for posts tagged as ${formattedSuccess.join(glue)}`;
                }
                else if (alertIdDelete) {
                    formattedSuccess = 'Alert deleted!';
                }
            }

            // NOTE No need to handle formValidation errors; errors extension does that for us (when errors are placed in req.app.formValidation)
            return reply.view('home/alerts', {
                title: 'Alerts',
                data: {
                    alerts,
                    formattedSuccess,
                    unalertedTags
                },
                inBodyAds: [
                    'one', 'two'
                ]
            });
        });
    }
};

// Place Mock.posts in alerts mocks

/**
{
    tags: [{ id, name }],   // From postService.fetchTags()
    alerts: [{              // From alertService.forUser(userId)
        id,
        tag: { id, name },
        posts: [{           // Intended to work with post_grid_item partial
            id,
            subject,
            location,
            date,
            type: { const, name },
            group {
                id,
                name,
                region: { name }
            },
            image,
            thumb,
            seen
        }]
    }],
    alertCount: Number      // From alertService.countForUser(userId),
}

**/

internals.alerts = [
    /*{
        id: 1,
        tag: {
            id: 1,
            name: 'furniture'
        },
        posts: []
    },*/
    {
        id: 2,
        tag: {
            id: 3,
            name: 'tools'
        },
        posts: []
    },
    {
        id: 3,
        tag: {
            id: 4,
            name: 'materials'
        },
        posts: []
    }
];

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
