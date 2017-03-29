'use strict';

var Hoek = require('hoek');
var WGQL = require('@freecycle/common-hapi-plugins/lib/graphql-wrapper');

const user = {
  avatar_url: "http://lorempixel.com/150/150/people/8",
  name: "Nathan Puente",
  username: 'npuente',
  description: "I'm a business-owener and entrepreneur in Tuscon.",
  thumbsup: 100,
  groups: [
    {
      name: 'Tucson',
      state: 'AZ',
    },
    {
      name: 'Marana',
      state: 'AZ',
    },
    {
      name: 'Vail',
      state: 'AZ',
    },
    {
      name: 'Oro Valley',
      state: 'AZ',
    }
]};


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
      auth:  {mode: 'required'},
      plugins: {
        // 'hapiAuthorization': {role: '1'}
        // you don't have to have any special privs to see your own dashboard, but this is how you do it.
      }
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
    path: '/user/{username}',
    config: {
      id: 'user',
      description: "The user's profile, viewed by others.",
      plugins: {
        // 'hapiAuthorization': {role: '1'}
        // you don't have to have any special privs to see your own dashboard, but this is how you do it.
      }
    },
    handler: function (request, reply) {
      const inBodyAds = [
        "one",
        "two"
      ];

      reply.view('user', {
        user: user,
        showFilterSelectors: false,
        filterType: 'circle',
        inBodyAds: inBodyAds,
        title: "User Profile",
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
      description: 'a certain static page stored in database. For example, try /pages/test',
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
      method: '*',
      path: '/login',
      config: {
        id: 'login',
        description: 'login on this page',
        auth: false,
      },
      handler: _loginHandler
    },

    {
      method: '*', // Must handle both GET and POST
      path: '/fb_login',          // The callback endpoint registered with the provider
      config: {
        id: 'Facebook Login',
        description: 'go here to log in via FB',
        auth: 'facebook',
        handler: _facebookLoginHandler
      }
    },

    {
        method: 'GET',
        path: '/logout',
        config: {
            id: 'logout',
            description: 'log out on this page, delete your cookie',
            auth: false,
            handler: function (request, reply) {
                "use strict";
                request.cookieAuth.clear();
                reply.view('logout', {
                    title: 'Logged out',
                });
            }
        }
    },
    {
        method: 'GET',
        path: '/home',
        config: {
            id: 'home',
            description: 'Front Door for logged-out users',
            auth: false,
        },
        handler: function (request, reply) {
          const localGroups = [
            "Tuscon", "Marana", "Oro Valley", "Vail", "Sanuarita"
          ];
          const metrics = [
            {
              name: "Members",
              count: '9,073,808'
            },
            {
              name: "Local Groups",
              count: '5,270'
            },
            {
              name: "Scams or Cost",
              count: '0'
            }
          ];
          "use strict";
          reply.view('home', {
              title: 'Freecycle',
              posts: posts.slice(0, 3),
              groups: localGroups,
              metrics: metrics,
              footerMenuItems: footerMenuItems
          });
        },
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
        // console.log("---------------------");

        for(var j = 0; j<route.table.length; j++) {
          var table = route.table[j];
          //console.log("****************");
          //console.log(table.path);
          if (table.path == '/pages/{page_path}') {
            // console.log(table.public.settings);
          }

          // exclude a route by adding a tag 'exclude' in the config.
          if(table.public.settings.tags) {
            var i = table.public.settings.tags.indexOf('exclude');
            // console.log(i);
            if (i > -1 ) {
              continue;
            }
          }
          results.push(table);   // this is an array of {route settings: method: path: etc } hashes.

        }
      }
      // TODO: the static pages need to return all the actual pages.

      // console.log("---------------------");
      // TODO: do some error catching, maybe - like what if there's no results?
      reply.view('sitemap', {
        title: "Site Map",
        footerMenuItems: footerMenuItems,
        pages: results,
      });
    }
  }

];


function _loginHandler(request, reply) {
  var msg = null;
  // if credentials are passed in from form...
  if(request.payload && request.payload.user && request.payload.password) {
    var user = request.payload.user;
    var pw = request.payload.password;

    request.server.methods.loginUser(user, pw, request.server, function (err,userId) {   //callback neccessary, i guess.???
      Hoek.assert(!err, 'loginUser ERROR: ' + err);

      var msg = null;
      // console.log('userID found after login:', userId);
      if (userId) {
        reply.setCookie(Number(userId), function (err,cookieContent) {
          Hoek.assert(!err, 'Error: ' + err);

          // or success
          reply.state('MyFreecycle', cookieContent);
          request.log('debug', 'ok we gave out the cookie', cookieContent);
          reply.redirect('/desktop-dash').temporary(true);

        });
       } else {
          // bad login.
          msg = 'invalid username/email or password.';
          reply.view('login', {
            title: 'Login Required',
            msg: msg
          });
       }

    });

  } else {
    reply.view('login', {
      title: 'Login Required',
      msg: msg
    });
  }
}

function _facebookLoginHandler (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply('Authentication failed due to: ' + request.auth.error.message);
  }

  // Perform any account lookup or registration, setup local session,
  // and redirect to the application. The third-party credentials are
  // stored in request.auth.credentials. Any query parameters from
  // the initial request are passed back via request.auth.credentials.query.
  // I assume we get facebook id from credentials and then look up the FC user id.

  var fbId = request.auth.credentials.profile.id;

  request.log('debug', fbId);
  // return reply.redirect('/desktop-dash');

  var query = "{ user_static (where: {facebook_id: " + fbId + "}) {   facebook_id user_id} } ";
  WGQL.GraphQLWrapper(request.server, query, 'user_static.user_id', function(err, result) {
    Hoek.assert(!err, err);
    var userId = result.user_static.user_id;
    console.log('userId ', userId);

    reply.setCookie(Number(userId), function (err,cookieContent) {
       Hoek.assert(!err, 'Error: ' + err);

       // or success
       reply.state('MyFreecycle', cookieContent);
       console.log('ok we gave out the cookie after Facebook login', cookieContent);
      return reply.redirect('/desktop-dash');
     });
  });
}
