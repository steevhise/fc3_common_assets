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
            auth: false
            /*plugins: { 'auth-cookie-freecycle': {
             redirectTo: false,
             redirectOnTry: false
             }}*/
        },
        handler: function (request, reply) {
            const postData = JSON.stringify(request.payload);   // may not really need this..

            //NOTE: this is the old logic that works for a post view. assistance is needed for saving a post.

            // first determine the "command", right?


            // then massage the fields being input, into the object. for example:

            const input = {
                post_id: request.payload.post_id,
                post_subject: request.payload.post_subject
            };  // etc etc

            new request.server.Post(postId, (err, post) => {


                Hoek.assert(!err, 'Problem getting Post!');
                Object.assign(post, input);    // or use Hoek.merge? Hoek.clone?

                post.save((err, postID) => {

                    Hoek.assert(!err, 'post did not save!' + err);
                    console.log('saved post id is: ' + postID);

                    // now return stuff to the browser (vue component?)
                    reply.view('whatever template', {
                        // whatever variables you're giving back to the vue component
                    });

                });


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
            });
        }
    }
];
