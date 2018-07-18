
const Boom = require('boom');
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

        const { authService } = request.server;
        const { email } = request.payload;

        return authService.sendPasswordReset(email)
        .then(() => reply({ message: `Password reset email successfully sent to ${request.payload.email}` }))
        .catch((err) => {

            if (err instanceof authService.UserDoesNotExistError) {
                return reply(Boom.badRequest('The provided email didn\'t match an account on our records'));
            }

            throw err;
        });
    }
};
