const Joi = require('joi');
const RouteHelpers = require('../helpers');

module.exports = {
    method: '*',
    path: '/signup',
    config: {
        id: 'pages_signup',
        description: 'Signup on this page',
        plugins: {
            crumb: {
                source: 'payload',
                cookieOptions: {
                    isSecure: false,
                    isHttpOnly: true
                }
            }
        },
        validate: {
            failAction: RouteHelpers.formFailAction,
            payload: {
                user: Joi.string()
                    .required()
                    .label('Username'),
                email: Joi.string()
                    .email()
                    .required()
                    .label('Email address'),
                password: Joi.string()
                    .required()
                    .label('Password'),
                confpassword: Joi.string()
                    .valid(Joi.ref('password'))
                    .strip()
                    .required()
                    .label('Password confirmation').options({
                        language: {
                            any: {
                                allowOnly: 'does not match password'
                            }
                        }
                    })
            },
            options: {
                abortEarly: false,
                language: {
                    key: '{{!label}} field '
                }
            }
        }
    },
    handler: function (request, reply) {

        const title = 'Sign up for Freecycle';

        if (request.auth.isAuthenticated) {

            // Redirect from successful signup, both FC and Facebook signups (user is new, but authenticated)
            if (request.query.success) {
                return reply.view('signup', {
                    title: 'Connect',
                    data: {
                        step2: {}
                    }
                });
            }

            return reply.redirect('/home/dashboard').temporary();
        }

        if (!request.payload) {

            // Unsuccessful fb-signup
            let errors;
            if (request.state.redirectedError) {
                errors = [request.state.redirectedError];
                reply.unstate('redirectedError');
            }

            return reply.view('signup', {
                title,
                errors: errors || [],
                data: {
                    step1: {}
                }
            });
        }

        // Below assumes we're POSTing to signup and not auth'd

        const { authService } = request.server;
        const { validation, user, email, password } = request.payload;
        const fail = (errors) => {

            return reply.view('signup', {
                title,
                errors: errors || [],
                data: {
                    step1: { email, user }
                }
            });
        };

        if (validation) {
            return fail();
        }

        return Promise.resolve()
        .then(() => {

            return authService.signup({ username: user, email, password });
        })
        .then((userId) => {

            return authService.grantToken(userId, request.info.remoteAddress);
        })
        .then(({ user_id: userId, token }) => {

            request.cookieAuth.set(userId, token);

            return reply.redirect('/signup?success=fc').temporary();
        })
        .catch((err) => {

            if (err instanceof authService.UserAlreadyExistsError) {

                const field = err.fields.username ? 'username' : 'email address';

                return fail([{
                    type: 'data',
                    message: `Sorry, that ${field} is already taken`
                }]);
            }

            throw err;
        });
    }
};
