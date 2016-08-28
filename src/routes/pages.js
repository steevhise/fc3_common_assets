'use strict';

const friends = [
  {
    avatar_url: "http://lorempixel.com/150/150/people/1",
    name: "Deron Beal",
    username: "deronbeal"
  },
  {
    avatar_url: "http://lorempixel.com/150/150/people/2",
    name: "Steev Hise",
    username: "steevhise"
  },
  {
    avatar_url: "http://lorempixel.com/150/150/people/3",
    name: "Nguyet Aleshire",
    username: "nuggeti"
  },
  {
    avatar_url: "http://lorempixel.com/150/150/people/4",
    name: "Dominick Amundson",
    username: "stayingalive"
  },
  {
    avatar_url: "http://lorempixel.com/150/150/people/5",
    name: "Garth Angers",
    username: "countrythunder2015"
  },
  {
    avatar_url: "http://lorempixel.com/150/150/people/6",
    name: "Tiffaney August",
    username: "augustsummer"
  },
  {
    avatar_url: "http://lorempixel.com/150/150/people/7",
    name: "Ronny Bartkowiak",
    username: "ronnnnnnnny"
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

// dummy post data
const posts = [
  {
    title: "Sofa Loveseat",
    location: "Tucson, AZ",
    time: "15 minutes ago",
    category: "wanted",
    image: "http://lorempixel.com/350/150/nightlife",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id."
  },
  {
    title: "Twin Bed Mattress",
    location: "Tucson, AZ",
    time: "15 minutes ago",
    category: "offer",
    image: "http://lorempixel.com/350/400/food",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id."
  },
  {
    title: "Computer Monitor",
    location: "Tucson, AZ",
    time: "15 minutes ago",
    category: "borrow",
    image: "http://lorempixel.com/350/500/city",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id."
  },
  {
    title: "Nail Gun",
    location: "Tucson, AZ",
    time: "15 minutes ago",
    category: "lend",
    image: "http://lorempixel.com/350/250/sports",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id."
  }];

// route definitions
module.exports = [
  {
    method: 'GET',
    path: '/styleguide',
    config: {
      id: 'style guide',
      description: 'this is a demonstration page of all the componenets of the site.',
      auth: false
    },
    handler: function (request, reply) {
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

      const posts = [
        {
          title: "Sofa Loveseat",
          location: "Tucson, AZ",
          time: "15 minutes ago",
          category: "wanted",
          image: "http://lorempixel.com/350/150/nightlife",
          description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id."
        },
        {
          title: "Twin Bed Mattress",
          location: "Tucson, AZ",
          time: "15 minutes ago",
          category: "offer",
          image: "http://lorempixel.com/350/400/food",
          description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id."
        },
        {
          title: "Computer Monitor",
          location: "Tucson, AZ",
          time: "15 minutes ago",
          category: "borrow",
          image: "http://lorempixel.com/350/500/city",
          description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id."
        },
        {
          title: "Nail Gun",
          location: "Tucson, AZ",
          time: "15 minutes ago",
          category: "lend",
          image: "http://lorempixel.com/350/250/sports",
          description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis molestias, facere quisquam itaque! Labore nihil architecto nobis, repellat explicabo sit. Soluta itaque repudiandae ducimus velit aliquid, deleniti quas dicta tempora doloribus sed accusantium veniam aliquam fuga nulla iure molestiae dolore nemo unde laudantium quia! Possimus autem, nesciunt eligendi accusamus consectetur numquam. Eveniet et natus distinctio dicta reiciendis, laboriosam repellendus, in officia, accusantium saepe eos asperiores minima incidunt cupiditate sapiente doloribus id."
        }];

      reply.view('index', { friends: friends, title: "Styleguide", footerMenuItems: footerMenuItems, posts: posts });
    }
  },
  {
    method: 'GET',
    path: '/submit-post',
    config: {
      id: 'submit a post',
      description: 'Where users create new posts.',
    },
    handler: function (request, reply) {
      const inBodyAds = [
        "one",
        "two"
      ];

      reply.view('submit_post', {
        inBodyAds: inBodyAds,
        title: "Post Reply",
        footerMenuItems: footerMenuItems
      });
    }
  },
  {
    method: 'GET',
    path: '/desktop-dash',
    config: {
      id: 'Dashboard',
      description: "The user's 'home'.",
    },
    handler: function (request, reply) {
      const inBodyAds = [
        "one",
        "two"
      ];

      reply.view('desktop_dash', {
        messageSets: [
          {
            messageHeader: "My Replies",
            messages: [
              {
                title: "Kid Clothes",
                image: "http://lorempixel.com/250/250",
                category: "offer",
                type: "Reply",
                time: '10 Minutes Ago',
                id: 1
              },
              {
                title: "Acrylic Paints",
                image: "http://lorempixel.com/250/250",
                category: "offer",
                type: "Reply",
                time: '15 Minutes Ago',
                id: 2
              }
            ]
          },
          {
            messageHeader: "Replies to My Posts",
            messages: [
              {
                title: "Vaccum Cleaner with a very long title",
                category: "wanted",
                image: "http://lorempixel.com/250/250",
                type: "PostReply",
                time: '15 Minutes Ago',
                notification: "7 unread replies",
                id: 3
              },
              {
                title: "Canon 560 Printer",
                category: "lend",
                image: "http://lorempixel.com/250/250",
                type: "PostReply",
                time: '15 Minutes Ago',
                notification: "15 unread replies",
                id: 5
              },
              {
                title: "Patio Furniture",
                category: "offer",
                image: "http://lorempixel.com/250/250",
                type: "PostReply",
                time: '15 Minutes Ago',
                notification: "1 unread reply",
                id: 6
              }
            ]
          },
          {
            messageHeader: "Chat With Friends",
            messages: [
              {
                title: "Deron Beal",
                image: "http://lorempixel.com/250/250",
                type: "ChatMessage",
                time: '1 Week Ago',
                id: 7
              },
              {
                title: "Steev Hise",
                image: "http://lorempixel.com/250/250",
                type: "ChatMessage",
                time: '2 Weeks Ago',
                id: 8
              }
            ]
          }
        ],
        showFilterSelectors: true,
        filterType: 'circle',
        friends: friends,
        inBodyAds: inBodyAds,
        title: "Desktop Dash",
        footerMenuItems: footerMenuItems,
        posts: posts
      });
    }
  },
  {
    method: 'GET',
    path: '/pages/{page_path}',
    config: {
      id: 'static pages',
      description: 'a certain static page stored in database.',
    },
    handler: function (request, reply) {
      const inBodyAds = [
        "one",
        "two"
      ];

      var page_path = request.params.page_path;
      console.log(page_path);

      var query = '{ page (where: {path: "' + page_path + `"})
        {
          page_id
          title
          content
          path
        }
      }`;

      // TODO: cache this
      var page = request.server.graphql(request.server.schema, query)
          .then(function(queryResult) {
            var retval;
            if (typeof queryResult.data.page === 'undefined' || queryResult.data.page === null) {
              retval = "404";
            }
            else if (queryResult.data.page) {
              retval = Object.assign({}, queryResult.data.page);
              console.log('result from page query is ', retval);
            } else {    // put this first?
              console.log('error', queryResult);
              retval = queryResult.toString || 'unknown error.';
            }
            return retval;
          })
          .then( page => {
            if(typeof page === 'string') {
              // error of some kind.
              if(page === '404') {
                reply.view('error_template', { statusCode: 404, errorTitle: "Not Found", errorMessage: "Sorry, '" + request.path + "' not found."});
              } else {
                console.log('some other error', page);
                reply.view('error_template', { statusCode: 500, errorTitle: "Server Error", errorMessage: page});
              }
            }  else {   // success!
              reply.view('static_template', {
                title: page.title,
                footerMenuItems: footerMenuItems,
                static_content: function pageContent() { return page.content;},
              });
            }
          })
          .catch(function (reason) {
            // handle rejected promise
            console.error('page query GraphQL promise rejected. (' + reason + ').');
            throw reason;
          });
    }
  },
  {
    method: 'GET',
    path: '/',
    config: {
      id: 'Site Map',
      description: 'Simple list of all pages on site.',
    },
    handler: function (request, reply) {
      var routeTable = request.server.table();
      var results = [];

      for(var i = 0; i < routeTable.length; i++){
        var route = routeTable[i];
        console.log("---------------------");

        for(var j = 0; j<route.table.length; j++) {
          var table = route.table[j];
          console.log("****************");
          console.log(table.path);
          if (table.path == '/pages/{page_path}') {
            console.log(table.public.settings);
          }

          // exclude a route by adding a tag 'exclude' in the config.
          if(table.public.settings.tags) {
            var i = table.public.settings.tags.indexOf('exclude');
            console.log(i);
            if (i > -1 ) {
              continue;
            }
          }
          results.push(table);   // this is an array of {route settings: method: path: etc } hashes.

        }
      }
      // TODO: the static pages need to return all the actual pages.

      console.log("---------------------");
      // TODO: do some error catching, maybe - like what if there's no results?
      reply.view('sitemap', {
        title: "Site Map",
        footerMenuItems: footerMenuItems,
        pages: results,
      });
    }
  }

];