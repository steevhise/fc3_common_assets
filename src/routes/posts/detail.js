const Joi = require('joi');

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

        request.log('debug', 'about to look up post ' + postId);

        new request.server.Post(postId, (err, post) => {

            if (err) {
                return reply(err);
            }

            reply.view('posts/post', {
                showFilterSelectors: true,
                post,
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
