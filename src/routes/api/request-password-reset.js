const Joi = require('joi');

const internals = {};

module.exports = {
    method: 'POST',
    path: '/api/request-password-reset',
    config: {
        tags: ['api'],
        validate: {
            payload: {
                email: Joi.string().email().required()
            }
        }
    },
    handler(request, reply) {

        console.log(request.payload.email, 'EMAIL RECEIVED IN PAYLOAD!');
        return reply({ message: `Password reset email successfully sent to ${request.payload.email}` });
    }
};
