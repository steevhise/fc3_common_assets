
const Joi = require('joi');
const RouteHelpers = require('../helpers');

module.exports = {
    method: '*',
    path: '/login/password-reset/{token}',
    config: {
        id: 'pages_password_reset',
        description: 'login on this page',
        auth: false,
        validate: {
            failAction: RouteHelpers.formFailAction,
            payload: {
                token: Joi.string().token().required(),
                password: Joi.string().max(32).required()
            }
        },
        pre: [
            (request, reply) => {

                if (request.method === 'get' || request.app.formValidation) {
                    return reply.continue();
                }

                const { authService } = request.server;
                const { token, password } = request.payload;

                return authService.resetPassword(token, password)
                .then(() => reply.redirect('/login').takeover())
                .catch((err) => {

                    if (err instanceof authService.InvalidPasswordResetTokenError) {
                        request.app.formValidation = request.app.formValidation || [];
                        request.app.formValidation.push({
                            message:
                                `Your password reset token (long word at the end of this page\'s URL) is invalid (probably expired).
                                Try requesting a new one on the login form and trying again`,
                            path: 'token',
                            type: 'form'
                        });
                        return reply.continue();
                    }

                    return reply(err).takeover();
                });
            }
        ]
    },
    handler: (request, reply) => {

        const { token } = request.params;

        return reply.view('password-reset', {
            title: 'Reset Your Password',
            data: {
                token
            }
        });
    }
};
