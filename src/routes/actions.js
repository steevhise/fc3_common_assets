const Hoek = require('hoek');
const gql = require('graphql-tag');

// NOTE: This will probably move to a class, placing here for testing purposes.

// const mutatePost = (server, postId) => {
//     const mutation = gql`
//         mutation postMutation {
//             updatePostById(id: postId) {
//                 post_subject
//             }
//         }
//     `;
// };

// route definitions
module.exports = [
    {
        method: 'POST',
        path: '/actions', // this path will contain two query param options ?command={postEditNew}&data={mutation|query data}
        config: {
            id: 'actions',
            description: 'the actions route',
            auth:  { mode: 'required' }
            /* plugins: { 'auth-cookie-freecycle': {
                redirectTo: false,
                redirectOnTry: false
            }} */
        },
        handler: function (request, reply) {
            const data = JSON.stringify(request.params.data);
            const method = JSON.stringify(request.params.method);
            console.log(method);
            console.log(data);
            // request.log('debug', 'about to look up post ' + postId);
            console.log(request.params);

            // new request.server.Post(postId, (err, post) => {
            //
            //     Hoek.assert(!err, 'Probem getting Post!');
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
