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

        const inBodyAds = [
            'one',
            'two'
        ];

        let userPosts;
        userPosts = findMyPosts(request, (err, result) => {

            if (err) {
                return reply(err);
            }

            userPosts = result;

            request.log('my-post', 'in the route - ' + userPosts);

            reply.view('./home/my_posts', {
                inBodyAds,
                title: 'My Posts',
                showFilterSelectors: true,
                showCityDropdown: true,
                posts: userPosts,
                postAction: 'Manage'
            });
            return Promise.resolve();
        });

    }
};

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

        if (err) {
            return next(err);
        }

        if (!result) {
            return next(new Error('no user found?'));
        }

        // otherwise...
        currentUser = result;

        return currentUser.getPosts('open', (err, result2) => {      // getPosts() returns an array

            Hoek.assert(!err, err);
            myPostIDs = result2;

            const myPosts = [];   // the array of post objects.
            // console.log('post IDs: ', myPostIDs);

            // now make a Post object for each id.
            myPostIDs.forEach((p, i) => {

                let post;
                myPosts[i] = new Promise((resolve, reject) => {

                  // TODO: obvs this is part-fake data
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
