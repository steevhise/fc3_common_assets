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
                post_description: request.payload.post_description,
                post_location: request.payload.post_location
            };

            post = new request.server.Post(postId, (err, result) => {
                Hoek.assert(!err, 'Problem getting Post!');
                post = result;
            });

            Object.assign(post, input);    // or use Hoek.merge? Hoek.clone?

            let newPost = post.save((err, post) => {
                Hoek.assert(!err, 'post did not save!' + err);
                console.log('saved post id is: ' + post.post_id); 
            });

            reply.redirect(`/home/edit_post/${post.post_id}`, {
                post: newPost,
                title: `Edit Post : ${post.post_id}`,
                message : `Post ${post.post_id} was saved successfully.`
            });
        }
    }
];
