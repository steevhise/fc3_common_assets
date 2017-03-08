'use strict';

const localGroups = [
  "Tuscon", "Marana", "Oro Valley", "Vail", "Sanuarita"
];

// fake data for now
const group = {
         "group_id": 1014,
         "group_name": "Tucson",
         "group_status_id": 5,
         "yahoo_group_name": "freecycle",
         "longitude": 0,
         "latitude": 0,
         "description": "<p><span style=\"font-family: Verdana, Arial, sans-serif; line-height: 13px; text-align: left;\">%%freecycle_logo</span></p>\r\n<p>Welcome to&nbsp;the %%group_name Freecycle group!</p>\r\n<p>Tucson became the first local Freecycle group on the planet back in 2003 and we're proud to be the founding Freecycle community! The Freecycle Network&trade; is made up of %%num_groups groups with %%total_num_members members across the planet. It's a grassroots and entirely nonprofit movement of people who are giving (and getting) stuff for free in their own towns and thus keeping good stuff out of landfills. fiddle</p>\r\n<p>Membership is free, and everything posted must be FREE, legal and appropriate for all ages. To view the items being given away or sought in %%group_name, you must be a member of the local group. To join click on \"sign up\". If you are already a member, you may use the \"Post\" tab on the top right of this page to make your post to the local group.&nbsp; If you have any questions, please direct them to the Tucson moderating team; The contact box is located on our main local group \"All Items\" page next to the number of members up top.</p>\r\n<p>If your concern is about a list outside Tucson, AZ please contact: <strong>info@freecycle.org</strong> .&nbsp;</p>\r\n<p>Thanks so much and have fun! Your Mod Team. :-)</p>\r\n<hr />\r\n<p>%%disclaimer</p>",
         "num_members": 14057,
         "region": {
           "region_id": 5,
           "region_name": "Arizona",
           "country": {
             "country_id": 1,
             "country_name": "United States"
           }
       },
       "posts": [
         {
             title: 'Sofa Loveseat',
             location: 'Tucson, AZ',
             time: '15 minutes ago',
             category: 'wanted',
             image: 'http://lorempixel.com/350/150/nightlife',
             description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
         },
         {
             title: 'Twin Bed Mattress',
             location: 'Tucson, AZ',
             time: '15 minutes ago',
             category: 'offer',
             image: 'http://lorempixel.com/350/400/food',
             description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
         },
         {
             title: 'Computer Monitor',
             location: 'Tucson, AZ',
             time: '15 minutes ago',
             category: 'borrow',
             image: 'http://lorempixel.com/350/500/city',
             description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
         },
         {
             title: 'Nail Gun',
             location: 'Tucson, AZ',
             time: '15 minutes ago',
             category: 'lend',
             image: 'http://lorempixel.com/350/250/sports',
             description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id.'
         }
       ]
     };

// route definitions
module.exports = [
    {
        method: 'GET',
        path: '/group/{unique_group_name}',
        config: {
            id: 'group',
            description: 'a group page, for example try /group/freecycle',
            /*plugins: { 'auth-cookie-freecycle': {
             redirectTo: false,
             redirectOnTry: false
             }}*/
        },
        handler: function (request, reply) {
            const inBodyAds = [
                "one",
                "two"
            ];

            var unique_name = request.params.unique_group_name;
            request.log('debug', 'about to look up group ' + unique_name);

           /* new request.server.Group(unique_name, function(err, group) {
                console.log('returned from  constructor:');
                console.log(group);*/

                reply.view('./groups/group.html', {
                    inBodyAds: inBodyAds,
                    // title: "Post #" + post_id,
                    // footerMenuItems: footerMenuItems,
                    group: group,
                    posts: group.posts,
                    groups: localGroups
                });

            // });
        }
    },
    {
        method: 'GET',
        path: '/group/guidelines/{unique_group_name}',
        config: {
            id: 'group_guidelines',
            description: 'The named group\'s guidelines.'
        },
        handler: function (request, reply) {
            const inBodyAds = [
                'one',
                'two'
            ];
            reply.view('./groups/guidelines', {
              inBodyAds: inBodyAds,
              // title: "Post #" + post_id,
              // footerMenuItems: footerMenuItems,
              group: group
            });
        }
    },
    {
        method: 'GET',
        path: '/group/announcements/{unique_group_name}',
        config: {
            id: 'group_announcements',
            description: 'The named group\'s announcements.'
        },
        handler: function (request, reply) {
            const inBodyAds = [
                'one',
                'two'
            ];
            reply.view('./groups/announcements', {
              inBodyAds: inBodyAds,
              // title: "Post #" + post_id,
              // footerMenuItems: footerMenuItems,
              group: group
            });
        }
    },
    {
        method: 'GET',
        path: '/group/contact/{unique_group_name}',
        config: {
            id: 'group_contact',
            description: 'The named group\'s guidelines.'
        },
        handler: function (request, reply) {
            const inBodyAds = [
                'one',
                'two'
            ];
            reply.view('./groups/contact', {
              inBodyAds: inBodyAds,
              // title: "Post #" + post_id,
              // footerMenuItems: footerMenuItems,
              group: group
            });
        }
    },
    {
        method: 'GET',
        path: '/group/info/{unique_group_name}',
        config: {
            id: 'group_info',
            description: 'The named group\'s information.'
        },
        handler: function (request, reply) {
            const inBodyAds = [
                'one',
                'two'
            ];
            reply.view('./groups/info', {
              inBodyAds: inBodyAds,
              // title: "Post #" + post_id,
              // footerMenuItems: footerMenuItems,
              group: group
            });
        }
    },
];
