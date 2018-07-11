const Boom = require('boom');
const Joi = require('joi');

const internals = {};

module.exports = {
    path: '/api/messaging/topics/{type}/{id?}',
    method: 'GET',
    config: {
        description: 'Endpoint for retrieving all threads on a specified topic',
        tags: ['api'],
        auth: { mode: 'required' },
        validate: {
            params: {
                type: Joi.string()
                    .valid('post', 'friend', 'system', 'group')
                    .required(),
                id: Joi.when('type', {
                    is: Joi.string().not('system'),
                    then: Joi.number().required()
                })
            }
        }
    },
    handler: (request, reply) => {

        const { id: userId } = request.auth.credentials;
        const { type, id } = request.params;
        const { messagingService } = request.server;

        return messagingService.fetchTopic(userId, { type, id })
        .then((topic) => reply(topic))
        .catch((err) => {

            if (err instanceof messagingService.TopicDoesNotExistError) {
                throw Boom.notFound('Topic not found');
            }

            throw err;
        });
    }
};
