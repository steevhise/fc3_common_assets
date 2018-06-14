const Boom = require('boom');
const Joi = require('joi');

const internals = {};

module.exports = {
    method: 'get',
    path: '/api/messaging/threads/{identifier*}',
    config: {
        tags: ['api'],
        auth: { mode: 'required' },
        validate: {
            // Allows route to accept requests of both /threads/5 (5 = thread id) and /threads/group/{groupId} or /threads/post/{postId}/{otherUsersId}
            params: (value, options, next) => {

                const threadParams = value.identifier.split('/');

                if (threadParams.length === 1) {
                    return Joi.validate(threadParams[0], Joi.number().integer(), (err, val) => {

                        if (err) {
                            return next(err);
                        }

                        return next(null, val);
                    });
                }

                const threadIdentifier = {
                    type: null,
                    id: null,
                    userId: null
                };

                Object.keys(threadIdentifier).forEach((k, i) => {

                    threadIdentifier[k] = threadParams[i];
                });

                return Joi.validate(threadIdentifier, Joi.object({
                    type: Joi.string().valid('friend', 'group', 'post', 'system').required(),
                    // Can't be integer, post ids may exceed limit of Joi's definition of integer
                    id: Joi.when('type', {
                        is: Joi.string().not('system'), // TODO Not right, would mean request of /threads/system i.e. ambiguous for all sys requests
                        then: Joi.number().required()   // Are system threads identifiable by userId and type? I don't think so? What else would we need?
                    }),                                 // How do we uniquely identify system-type messages other than by thread id? (do we need to?)
                    userId: Joi.when('type', {
                        is: 'post',
                        then: Joi.number().required()
                    })
                }), (err, val) => {

                    if (err) {
                        return next(err);
                    }

                    return next(null, val);
                });
            }
        },
        handler(request, reply) {

            const { messagingService } = request.server;

            const { id: userId } = request.auth.credentials;
            const threadIdentifier = request.params;

            return Promise.resolve()
            .then(() => messagingService.fetchThread(userId, threadIdentifier))
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
