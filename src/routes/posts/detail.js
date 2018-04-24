const Joi = require('joi');
const Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/posts/{postId}',
    config: {
        id: 'posts_detail',
        description: 'An individual post.  use a number, like /posts/123454',
        validate: {
            params: Joi.object({
                postId: Joi.number()
            })
        }
    },
    handler: function (request, reply) {

        const { postId } = request.params;
        const { postService } = request.server;
        const { isAuthenticated, credentials } = request.auth;

        request.log('debug', 'about to look up post ' + postId);

        return postService.fetchByIdentifier(postId, { viewerId: isAuthenticated && credentials.id })
        .then((post) => {

            if (!post) {
                throw Boom.notFound('That post was not found, and may have been closed.');
            }

            // Handles forbidden edit, redirected from edit-post
            const errors = [];
            if (request.state.redirectedError) {
                const { redirectedError } = request.state;
                if (redirectedError.type === 'postEditForbidden') {
                    errors.push({
                        message: redirectedError.message
                    });
                }
                // Clean up the error cookie to ensure no fraudulent errors on subsequent visits in the session
                reply.unstate('redirectedError');
            }
            console.log(post.hasOwnProperty, post.type.hasOwnProperty);
            reply.view('posts/post', {
                data: {
                    post
                },
                errors,
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
