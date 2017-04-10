const Hoek = require('hoek');

const friends = [
    {
        avatar_url: 'http://lorempixel.com/150/150/people/1',
        name: 'Deron Beal',
        username: 'deronbeal'
    },
    {
        avatar_url: 'http://lorempixel.com/150/150/people/2',
        name: 'Steev Hise',
        username: 'steevhise'
    },
    {
        avatar_url: 'http://lorempixel.com/150/150/people/3',
        name: 'Nguyet Aleshire',
        username: 'nuggeti'
    },
    {
        avatar_url: 'http://lorempixel.com/150/150/people/4',
        name: 'Dominick Amundson',
        username: 'stayingalive'
    },
    {
        avatar_url: 'http://lorempixel.com/150/150/people/5',
        name: 'Garth Angers',
        username: 'countrythunder2015'
    },
    {
        avatar_url: 'http://lorempixel.com/150/150/people/6',
        name: 'Tiffaney August',
        username: 'augustsummer'
    },
    {
        avatar_url: 'http://lorempixel.com/150/150/people/7',
        name: 'Ronny Bartkowiak',
        username: 'ronnnnnnnny'
    }
];

// see google docs for custom svg settings, these are just a few mainly the
// ones we would use to configure a new icon. but you can also pass things like maxWidth,
// and other settings as well https://developers.google.com/maps/documentation/javascript/symbols
const customIcon = {
    path : 'M10.75,0A6.25,6.25,0,0,0,4.5,6.25c0,6,6.25,13.75,6.25,13.75S17,12.22,17,6.25A6.25,6.25,0,0,0,10.75,0Zm0,9.7a3.38,3.38,0,1,1,3.38-3.38A3.37,3.37,0,0,1,10.75,9.7Z',
    fillColor : 'teal',
    fillOpacity : 0.8,
    strokeColor : 'white',
    scale : 2
};

const myGroupsGeomap = {
    settings: {
        'height' : '400',
        'width': '100%'
    },
    markers: [
        { 'lat' : 32.5, 'lng' : -110.09, 'description' : 'Tucson', 'icon' : 'group' },
        { 'lat' : 32.0, 'lng' : -111.09, 'description' : 'Oro Valley', 'icon' : 'user' },
        { 'lat' : 31.5, 'lng' : -110.09, 'description' : 'Green Valley', 'icon' : 'post' },
        { 'lat' : 33.5, 'lng' : -110.09, 'description' : 'Custom Marker Test', 'icon' : { custom : customIcon } },
        { 'lat' : 33.0, 'lng' : -110.09, 'description' : '<strong>No Icon Check</strong><br/><p>Also a test for html as the description</p>' },
        { 'lat' : 32.10, 'lng' : -110.09, 'description' : 'Read More Marker Test', 'readmore' : { text : 'Click Me', path : '/home/some-404-page/' } }
    ]
};

const myGroups = [
    {
        name: 'Tucson',
        state: 'AZ',
        distance: '0 miles' // unit should probably be separated for our UK bros, correct?
    },
    {
        name: 'Marana',
        state: 'AZ',
        distance: '15 miles'
    },
    {
        name: 'Vail',
        state: 'AZ',
        distance: '15 miles'
    },
    {
        name: 'Oro Valley',
        state: 'AZ',
        distance: '15 miles'
    }
];

// dummy footer items
const footerMenuItems = [
    'Local Groups',
    'Merchandise',
    'Donate',
    'Privacy',
    'About',
    'Sponsors',
    'Volunteer',
    'Terms',
    'News',
    'Help',
    'Contact',
    'Wiki'];

/**
 * gets all the posts of the current user
 * @returns array of Freecycle Post objects
 * @param req  request object
 * @param next {function}  callback
 */
const findMyPosts = function (req, next) {

    let myPostIDs;   // the array of post ids.
    let currentUser;
    new req.server.User(Number(req.auth.credentials.id), (err, result) => {

        Hoek.assert(!err, err);
        if (!result) {
            throw 'no user found?';
        }

        // otherwise...
        currentUser = result;
        currentUser.getPosts('open', (err, result2) => {

            Hoek.assert(!err, err);
            myPostIDs = result2.posts;   // this is an array of post ids.
            const myPosts = [];   // the array of post objects.

            // now make a Post object for each id.
            myPostIDs.forEach((p, i) => {

                let post;
                myPosts[i] = new Promise((resolve, reject) => {

                    new req.server.Post(p.post_id, (err, result3) => {

                        Hoek.assert(!err, err);
                        post = result3;
                        post.location = 'Tucson, AZ';
                        post.image = 'http://lorempixel.com/350/150/nightlife';
                        post.category = 'wanted';
                        myPosts[i] = post;
                        resolve(post);
                    });
                });
            });

            return Promise.all(myPosts).then((values) => {

                req.log('findMyPosts-allLoaded', values);
                return next(null, values);
            });
        });
    });

};

// dummy post data
const posts = [
    {
        post_subject: 'Sofa Loveseat',
        group: { group_name: 'Tucson, AZ' },
        post_date: '15 minutes ago',
        postType: { post_type_name: 'WANTED' },
        image: 'http://lorempixel.com/350/150/nightlife',
        post_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
    },
    {
        post_subject: 'Twin Bed Mattress',
        location: 'Tucson, AZ',
        group: { group_name: 'Tucson, AZ' },
        post_date: '15 minutes ago',
        category: 'offer',
        postType: { post_type_name: 'OFFER' },
        image: 'http://lorempixel.com/350/400/food',
        post_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
    },
    {
        post_subject: 'Computer Monitor',
        location: 'Tucson, AZ',
        group: { group_name: 'Patagonia, AZ' },
        post_date: '15 minutes ago',
        category: 'borrow',
        postType: { post_type_name: 'BORROW' },
        image: 'http://lorempixel.com/350/500/city',
        post_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
    },
    {
        post_subject: 'Nail Gun',
        location: 'Tucson, AZ',
        group: { group_name: 'Phoenix, AZ' },
        post_date: '15 minutes ago',
        category: 'lend',
        postType: { post_type_name: 'LEND' },
        image: 'http://lorempixel.com/350/250/sports',
        post_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
    }];

// route definitions
module.exports = [
    {
        method: 'GET',
        path: '/home/my-friends',
        config: {
            id: 'MyFriends',
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
                friends,
                inBodyAds,
                title: 'My Friends',
                footerMenuItems,
                posts
            });
        }
    },
    {
        method: 'GET',
        path: '/home/my-groups',
        config: {
            id: 'My Groups',
            description: 'The logged in user\'s Groups.',
            auth:  { mode: 'required' }
        },
        handler: function (request, reply) {

            const inBodyAds = [
                'one',
                'two'
            ];
            reply.view('./home/my_groups', {
                inBodyAds,
                title: 'My Groups',
                myGroups,
                geomap: myGroupsGeomap,footerMenuItems
            });
        }
    },
    {
        method: 'GET',
        path: '/home/my-posts',
        config: {
            id: 'My Posts',
            description: 'Posts created by the logged in user.',
            auth:  { mode: 'required' }
        },
        handler: function (request, reply) {

            const inBodyAds = [
                'one',
                'two'
            ];

            let userPosts;
            findMyPosts(request, (err, result) => {

                Hoek.assert(!err, err);
                userPosts = result;

                request.log('my-post', 'in the route - ' + userPosts);

                reply.view('./home/my_posts', {
                    inBodyAds,
                    title: 'My Posts',
                    posts: userPosts,
                    postAction: 'Manage',
                    footerMenuItems
                });
                return Promise.resolve();
            });

        }
    },
    {
        method: 'GET',
        path: '/home/my-replies',
        config: {
            id: 'MyReplies',
            description: 'The logged in user\'s replies list.',
            auth:  { mode: 'required' }
        },
        handler: function (request, reply) {
            const inBodyAds = [
                'one',
                'two'
            ];
            reply.view('./home/my_replies', {
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
                filterType: 'circle',
                friends,
                inBodyAds,
                title: 'My Replies',
                footerMenuItems,
                posts
            });
        }
    },
    {
        method: 'GET',
        path: '/home/post_new',
        config: {
            id: 'PostNew',
            description: 'Create a new post.',
            auth: { mode: 'required' }
        },
        handler: function (request, post) {
            const inBodyAds = [
                'one', 'two'
            ];
            post.view('./home/post_new', {

            });
        }
    }
];
