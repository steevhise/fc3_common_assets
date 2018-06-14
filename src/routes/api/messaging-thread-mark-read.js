const Joi = require('joi');
const Boom = require('boom');

const internals = {};

module.exports = {
    path: '/api/messaging/threads/{threadId}/read',
    method: 'POST',
    config: {
        description: 'Mark all messages in a thread for the logged-in user as read',
        tags: ['api'],
        auth: { mode: 'required' },
        validate: {
            params: Joi.object({
                threadId: Joi.number().integer().required()
            })
        }
    },
    handler: (request, reply) => {

        const { id: userId } = request.auth.credentials;
        const { threadId } = request.params;
        const { messagingService } = request.server;

        return messagingService.markThreadAsRead(userId, threadId)
        .then(() => reply({ success: true }))
        .catch((err) => {

            if (err instanceof messagingService.ThreadDoesNotExistError) {
                throw Boom.notFound('Thread not found');
            }

            throw err;
        });
    }
};
