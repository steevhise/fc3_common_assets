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

        request.log('debug', 'about to look up post ' + postId);

        return postService.fetchByIdentifier(postId)
        .then((post) => {

            if (!post) {
                throw Boom.notFound('That post was not found, and may have been closed.');
            }

            reply.view('posts/post', {
                post,
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
