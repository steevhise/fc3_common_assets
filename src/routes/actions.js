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
            // first determine the "command", right?

            // then massage the fields being input, into the object. for example:
            const postId = Number(request.payload.post_id);
            const input = {
                post_id: request.payload.post_id,
                post_subject: request.payload.post_subject,
                post_description : request.payload.post_description
            };  // etc etc

            new request.server.Post(postId, (err, post) => {
                Hoek.assert(!err, 'Problem getting Post!');

                Object.assign(post, input);    // or use Hoek.merge? Hoek.clone?

                post.save((err, post) => {
                    Hoek.assert(!err, 'post did not save!' + err);
                    console.log('saved post id is: ' + post.post_id);

                    // now return stuff to the browser (vue component?)
                    reply.view(`/home/edit_post/${post.post_id}`, {
                        post,
                        title: `Edit Post : ${post.post_id}`,
                    });
                });
            });
        }
    }
];
