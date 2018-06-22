
const Boom = require('boom');
const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/api/messaging/send',
    config: {
        tags: ['api'],
        auth: { mode: 'required' },
        validate: {
            payload: {
                body: Joi.string().required(), // TODO Any constraints here?
                threadIdentifier: Joi.alternatives()
                    .try(
                        Joi.number().integer(), // A thread.thread_id provided
                        Joi.object({  // A conventional threadIdentifier (as described in the messaging service) provided
                            type: Joi.string().valid('friend', 'group', 'post', 'system').required(),
                            id: Joi.when('type', {
                                is: Joi.string().not('system'),
                                then: Joi.number().required()
                            }),
                            userId: Joi.number() // Not required for post threads here, as the sender might not have access to the other
                            // user's id at time of sending e.g. on initiating a post thread
                        })
                    ).required()
            }
        }
    },
    handler: (request, reply) => {

        const { messagingService } = request.server;

        const { id: userId } = request.auth.credentials;
        const { body, threadIdentifier } = request.payload;

        return Promise.resolve()
        .then(() => messagingService.sendMessage(userId, threadIdentifier, { body }))
        .then((messageId) => reply(messageId)) // TODO Is this a sensible / useful return value?
        .catch((err) => {

            if (messagingService.serviceErrors.some((errClass) => err instanceof errClass)) {
                throw Boom.boomify(err, { statusCode: 404, message: err.constructor.name });
            }

            throw err;
        });
    }
};
