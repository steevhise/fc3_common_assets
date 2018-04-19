const Joi = require('joi');
const RouteHelpers = require('../helpers');

module.exports = {
    method: '*',
    path: '/home/new-post',
    config: ({ postService }) => ({
        id: 'home_post_new',
        description: 'Create a new post.',
        auth: { mode: 'required' },
        validate: {
            failAction: RouteHelpers.formFailAction,
            payload: {
                subject: Joi.string()
                    .required()
                    .label('Title'),
                description: Joi.string()
                    .required()
                    .label('Description'),
                type: Joi.number()
                    .valid([
                        postService.OFFER,
                        postService.WANTED,
                        postService.BORROW,
                        postService.LEND
                    ])
                    .required()
                    .label('Type'),
                town: Joi.number()
                    .integer().min(1)
                    .empty(null, '')
                    .when('type', {
                        is: Joi.number().required().valid([
                            postService.BORROW,
                            postService.LEND
                        ]),
                        then: Joi.forbidden()
                    })
                    .label('Town'),
                location: Joi.string()
                    .empty('')
                    .label('Crossroads'),
                tags: Joi.array()
                    .single()
                    .items(Joi.number().integer().min(1))
                    .label('Tags'),
                acceptedTerms: Joi.boolean()
                    .valid(true)
                    .falsy('0', 'false', '')
                    .truthy('1', 'true')
                    .required()
                    .label('Terms of service')
            },
            options: {
                abortEarly: false,
                language: {
                    key: '{{!key}} field '
                }
            }
        },
        pre: [
            (request, reply) => {

                if (!request.payload) {
                    return reply.continue();
                }

                // Handle a POST

                // Failed validation
                if (request.payload.validation) {
                    return reply.continue();
                }

                const { postService } = request.server;
                const { id: userId } = request.auth.credentials;
                const { validation, acceptedTerms, ...post } = request.payload;

                return Promise.resolve()
                    .then(() => postService.create(userId, post))
                    .then((postId) => reply.redirect(`/posts/${postId}`).takeover())
                    .catch((err) => {

                        request.app.formValidation = request.app.formValidation || [];

                        if (err instanceof postService.InvalidTownError) {

                            request.app.formValidation.push({
                                type: 'form',
                                path: 'town',
                                message: 'Sorry, you can post to that town because you\'re not a member.'
                            });

                            return reply.continue();
                        }

                        return reply(err);
                    });
            }
        ]
    }),
    handler(request, reply) {

        const { postService, userService } = request.server;
        const { id: userId } = request.auth.credentials;
        const { validation, acceptedTerms, ...post } = request.payload || {};

        return Promise.all([
            postService.fetchTags(),
            userService.fetchTownMemberships(userId)
        ])
        .then(([tags, towns]) => {

            // Remove invalid form fields

            if (validation) {
                validation.info.forEach(({ path }) => {

                    delete post[path];
                });
            }

            reply.view('home/post_new', {
                title: 'Make a Post',
                data: {
                    post,
                    tags,
                    towns
                }
            });
        });
    }
};
