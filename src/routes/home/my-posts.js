const Hoek = require('hoek');

module.exports = {
    method: 'GET',
    path: '/home/my-posts',
    config: {
        id: 'home_myposts',
        description: 'Posts created by the logged in user.',
        auth:  { mode: 'required' }
    },
    handler: function (request, reply) {

        return findMyPosts(request).then((posts) => {

            request.log('my-post', 'in the route - ' + posts);

            reply.view('home/my_posts', {
                title: 'My Posts',
                showFilterSelectors: true,
                showCityDropdown: true,
                posts,
                postAction: 'Manage',
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};

/**
 * gets all the posts of the current user
 * @returns array of Freecycle Post objects
 * @param req  request object
 * @param next {function}  callback
 */
const findMyPosts = function (request) {

    const { postService, Post } = request.server;
    const userId = Number(request.auth.credentials.id);

    const getPostEntities = (p) => {

        return new Promise((resolve, reject) => {

            new Post(p.post_id, (err, post) => {

                if (err) {
                    return reject(err);
                }

                post.location = 'Tucson, AZ';
                post.image = 'http://lorempixel.com/350/150/nightlife';
                post.category = 'wanted';

                return resolve(post);
            });
        });
    };

    return postService.byUser(userId, 'open')
    .then((posts) => {

        return Promise.all(posts.map(getPostEntities));
    })
    .then((postEntities) => {

        request.log('findMyPosts-allLoaded', postEntities);

        return postEntities;
    });
};
