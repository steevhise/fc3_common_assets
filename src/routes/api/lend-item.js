const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/api/posts/{postId}/lend',
    config: {
        description: 'Lend a post to another user',
        tags: ['api'],
        auth: {
            mode: 'required'
        },
        validate: {
            payload: {
                borrower: Joi.number().required()
            },
            params: {
                postId: Joi.number()
            }
        }
    },
    handler: (request, reply) => {

        const { postService } = request.server;
        const { id: userId } = request.auth.credentials;
        const { postId } = request.params;
        const { borrower } = request.payload;

        return postService.lendPost(userId, borrower, postId)
        .then(reply)
        .catch((err) => {

            const { PostLendStateError , PostLendeeError } = postService;

            if (err instanceof PostLendStateError || err instanceof PostLendeeError) {
                return reply({ message: err.message }).code(400);
            }

            throw err;
        });
    }
};
