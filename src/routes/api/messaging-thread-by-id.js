const Boom = require('boom');
const Joi = require('joi');

const internals = {};

module.exports = {
    method: 'get',
    path: '/api/messaging/threads/{identifier}',
    config: {
        tags: ['api'],
        auth: { mode: 'required' },
        validate: {
            params: {
                identifier: Joi.number().required()
            }
        },
        handler(request, reply) {

            const { messagingService } = request.server;

            const { id: userId } = request.auth.credentials;
            const { identifier: threadId } = request.params;

            return Promise.resolve()
            .then(() => messagingService.fetchThread(userId, threadId))
            .then((thread) => reply(thread))
            .catch((err) => {

                if (messagingService.serviceErrors.some((errClass) => err instanceof errClass)) {
                    throw Boom.boomify(err, { statusCode: 404, message: err.constructor.name });
                }

                throw err;
            });
        }
    }
};
