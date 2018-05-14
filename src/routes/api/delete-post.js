const Hoek = require('hoek');
const Joi = require('joi');

module.exports = {
    method: 'DELETE',
    path: '/api/posts/{postId}',
    config: {
        tags: ['api', 'exclude'],
        validate: {
            params: {
                postId: Joi.number().integer()
            }
        },
        handler: (request, reply) => {

            const { postService } = request.server;
            const { postId } = request.params;
            const userId = Hoek.reach(request, 'auth.credentials.id');

            return postService.delete(postId, userId)
            .then(() => {

                return reply('Post deleted');
            });
        }
    }
};
