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
            const postId = Number(request.payload.post_id);  // schema requires a number not a string
            const input = {
                post_id: postId,
                post_subject: request.payload.post_subject,
                post_description: request.payload.post_description,
                post_location: request.payload.post_location
            };

            // NOTE this is asynchronous, so it should wrap everything else.
            let post = new request.server.Post(postId, (err, result) => {

                Hoek.assert(!err, 'Problem getting Post!');
                post = result;
                Object.assign(post, input);    // or use Hoek.merge? Hoek.clone?
                post.save((err, savedPostId) => {    // NOTE to Ryan: note that save method returns just a post id. not an object.

                    Hoek.assert(!err, 'post did not save!' + err);
                    console.log('saved post id is: ' + savedPostId);

                    // redirect needs to be inside this because the save() is asynchronous.
                    reply.redirect(`/home/edit_post/${savedPostId}`, {
                        postId: savedPostId,    // RYAN:  not sure if this data gets transmitted in a redirect... i dont' think so.
                        title: `Edit Post : ${savedPostId}`,
                        message : `Post ${savedPostId} was saved successfully.`
                    });
                });
            });
            reply.response({
                postId: postId,    // RYAN:  not sure if this data gets transmitted in a redirect... i dont' think so.
                title: `Edit Post : ${postId}`,
                message : `Post ${postId} was saved successfully.`
            });
        }
    }
];
