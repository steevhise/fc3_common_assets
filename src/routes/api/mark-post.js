
const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/api/posts/{postId}/mark',
    config: ({ postService }) => ({
        tags: ['api', 'exclude'],
        validate: {
            params: {
                postId: Joi.number().integer()
            },
            payload: {
                newType: Joi.string().required().valid([
                    'TAKEN',
                    'RECEIVED'
                ])
            }
        },
        auth:  { mode: 'required' }
    }),
    handler: (request, reply) => {

        const { postService } = request.server;
        const { postId } = request.params;
        const { newType } = request.payload;
        const { id: userId } = request.auth.credentials;

        return postService.update(postId, userId, { type: postService[newType] })
        .then(() => postService.fetchByIdentifier(postId, { open: true, approved: true, allowExpired: true, viewerId: userId }))
        .then(({ type }) => reply(type));
    }
};
