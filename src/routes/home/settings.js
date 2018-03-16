const Joi = require('joi');
const Hoek = require('hoek');
const RouteHelpers = require('../helpers');

module.exports = {
    method: '*',
    path: '/home/settings',
    config: {
        id: 'home_settings',
        description: 'Edit user profile.',
        auth: { mode: 'required' },
        payload: {
            multipart: { output: 'data' },
            maxBytes: 1048576 * 5,           // 5mb. TODO is this okay? It will be read into memory.
            failAction: (request, reply, error) => {

                // TODO ensure error is about image size and not some other parsing error

                request.app.formValidation = [{
                    type: 'form',
                    path: 'image',
                    message: 'The maximum image size is 5mb'
                }];

                return reply.continue();
            }
        },
        validate: {
            failAction: RouteHelpers.formFailAction,
            payload: Joi.object({
                firstName: Joi.string()
                    .allow('')
                    .label('First name'),
                lastName: Joi.string()
                    .allow('')
                    .label('Last name'),
                about: Joi.string()
                    .allow('')
                    .label('About'),
                email: Joi.string()
                    .email()
                    .allow('')
                    .label('Email address'),
                phone: Joi.string()
                    .allow('')
                    .label('Phone number'),
                homeTown: Joi.number()
                    .integer()
                    .label('Home town'),
                location: Joi.string()
                    .allow('')
                    .label('Default location'),
                languages: Joi.array()
                    .items(Joi.string().valid(['en', 'es', 'fr', 'de', 'eo'])) // TODO determine this list
                    .single()
                    .label('Language preferences').options({
                        language: {
                            any: {
                                allowOnly: 'must come from the provided list'
                            }
                        }
                    }),
                image: Joi.binary()
                    .label('Profile image'),
                password: Joi.string()
                    .label('Password'),
                confpassword: Joi.string()
                    .valid(Joi.ref('password'))
                    .strip()
                    .label('Password confirmation').options({
                        language: {
                            any: {
                                allowOnly: 'does not match password'
                            }
                        }
                    }),
            })
                .and('password', 'confpassword'),
            options: {
                abortEarly: false,
                language: {
                    key: '{{!label}} field '
                }
            }
        },
        pre: [
            (request, reply) => {

                if (!request.payload) {
                    return reply.continue();
                }

                // Handle a POST

                const { authService, userService } = request.server;
                const { id: userId } = request.auth.credentials;
                const { image, password, ...settings } = request.payload;

                console.log(settings)

                return Promise.resolve()
                    .then(() => Object.keys(settings).length && userService.updateSettings(userId, settings))
                    .then(() => password && authService.changePassword(userId, password))
                    .then(() => image && userService.changeProfileImage(userId, image))
                    .then(() => reply.continue());
            }
        ]
    },
    handler: function (request, reply) {

        const { userService } = request.server;
        const { credentials } = request.auth;

        return userService.fetchSettings(credentials.id)
        .then((settings) => {

            Hoek.assert(settings, 'User does not exist');

            return reply.view('home/settings', {
                title: 'Edit Settings',
                data: {
                    settings,
                    languageOptions: [ // TODO
                        { code: 'en', name: 'English' },
                        { code: 'es', name: 'Spanish' },
                        { code: 'fr', name: 'French' },
                        { code: 'de', name: 'German' },
                        { code: 'eo', name: 'Esperanto' }
                    ],
                    notificationOptions: [ // TODO
                        {
                            type: 'Email Digest',
                            description: 'Receive a summary of all new posts'
                        },
                        {
                            type: 'Per Post',
                            description: 'Receive an email for every new post'
                        },
                        {
                            type: 'Admin Only',
                            description: 'Only receive emails for new admin posts'
                        }
                    ]
                }
            });
        });
    }
};
