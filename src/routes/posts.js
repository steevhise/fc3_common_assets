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
    path: '/posts/{post_id}',
    config: {
        id: 'post',
        description: 'an individual post.  use a number, like /posts/123454',
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

      var post_id = Number(request.params.post_id);
        request.log('debug', 'about to look up post ' + post_id);

      new request.server.Post(post_id, function(err, post) {
        console.log('returned from Post constructor:');
        console.log(post);

        // return Promise.resolve(post1);

        reply.view('posts/post.html', {
          showFilterSelectors: true,
          inBodyAds: inBodyAds,
          // title: "Post #" + post_id,
          footerMenuItems: footerMenuItems,
          post: post
        });

      });
    }
  }
];
