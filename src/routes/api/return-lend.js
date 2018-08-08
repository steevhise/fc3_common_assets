const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/api/posts/{postId}/return',
    config: {
        description: 'A user marks their posted item as returned',
        tags: ['api'],
        auth: {
            mode: 'required'
        },
        validate: {
            params: {
                postId: Joi.number()
            }
        }
    },
    handler: (request, reply) => {

        const { postService } = request.server;
        const { id: userId } = request.auth.credentials;
        const { postId } = request.params;

        return postService.returnLentPost(userId, postId)
        .then(reply)
        .catch((err) => {

            const { PostLendStateError } = postService;

            if (err instanceof PostLendStateError) {
                return reply({ message: err.message }).code(400);
            }

            throw err;
        });
    }
};
