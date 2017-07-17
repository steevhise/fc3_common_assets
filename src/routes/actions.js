const Hoek = require('hoek');
const gql = require('graphql-tag');

// route definitions
module.exports = [
    {
        method: '*',
        path: '/actions',
        config: {
            id: 'actions',
            description: 'the actions route',
            auth:  false
            /*plugins: { 'auth-cookie-freecycle': {
                redirectTo: false,
                redirectOnTry: false
            }}*/
        },
        handler: function (request, reply) {
            const postData = JSON.stringify(request.payload);

            //NOTE: this is the old logic that works for a post view. assistance is needed for saving a post.
            // new request.server.Post(postId, (err, post) => {
            //
            //     Hoek.assert(!err, 'Problem getting Post!');
            //     console.log('returned from Post constructor:');
            //     console.log(post);
            //
            //     reply.view('posts/post.html', {
            //         showFilterSelectors: true,
            //         inBodyAds,
            //         // title: "Post #" + post_id,
            //         footerMenuItems,
            //         post
            //     });
            // });
        }
    }
];
