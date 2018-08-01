const Boom = require('boom');
const Joi = require('joi');
const RouteHelpers = require('../helpers');

module.exports = {
    method: '*',
    path: '/home/new-post',
    config: ({ postService }) => ({
        id: 'home_post_new',
        description: 'Create a new post.',
        auth: { mode: 'required' },
        payload: {
            // processes any input from the images field into Buffers representing the image files in memory
            multipart: { output: 'data' },
            maxBytes: 1048576 * postService.MAX_POST_IMAGES, // 1mb per image
            failAction: (request, reply, error) => {

                // TODO ensure error is about image size and not some other parsing error

                request.app.formValidation = request.app.formValidation || [];
                request.app.formValidation = [{
                    type: 'form',
                    path: 'image',
                    message: 'The maximum individual image size is 1mb'
                }];

                return reply.continue();
            }
        },
        validate: {
            failAction: RouteHelpers.formFailAction,
            // We have to explicitly wrap the entire schema in Joi.object
            // so we can append the empty rule at the end, which covers the case where the payload processing fails, in which
            // case the payload is null and would otherwise trigger the validation fail action with an opaque, Joi-internals error message
            payload: Joi.object({
                subject: Joi.string()
                    .required()
                    .label('Title'),
                description: Joi.string()
                    .required()
                    .label('Description'),
                type: Joi.number()
                    .valid([
                        // TODO Need to add TAKEN and RECEIVED here?
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
                        // TODO Require town if not forbidden
                        is: Joi.number().required().valid([
                            postService.BORROW,
                            postService.LEND
                        ]),
                        then: Joi.forbidden()
                    })
                    .label('Town'),
                location: Joi.string()
                    .allow('')
                    .default('', 'Default to empty string, as hotwords check expects this value to be a string')
                    .label('Crossroads'),
                images: Joi.array()
                    // Handles the case of 1 valid upload
                    .single()
                    .items(Joi.binary().min(1))
                    .max(postService.MAX_POST_IMAGES)
                    // one of the empty schemas is an empty object because the route's configured multipart processing outputs an empty object
                    // when no images are sent in the payload AND the form's encoding is multipart/form-data (enctype="multipart/form-data")(which it is and needs to be to upload image files)
                    // If the form is not encoded thusly, the output of an empty images input is an empty Buffer. Not sure what this means, just felt it was odd/worth noting :)
                    .empty({}, '', null)
                    .when('type', {
                        // People can post images only of what they have (no hypotheticals, only reals)
                        is: Joi.any().required().valid([
                            postService.BORROW,
                            postService.WANTED
                        ]),
                        then: Joi.forbidden()
                    })
                    .label('Post images'),
                tags: Joi.array()
                    .single()
                    .items(Joi.number().integer().min(1))
                    .label('Tags')
            })
            .empty(null),
            options: {
                abortEarly: false,
                language: {
                    key: '{{!key}} field '
                }
            }
        },
        pre: [
            RouteHelpers.validateImagesPre,
            (request, reply) => {

                if (request.method === 'get') {
                    return reply.continue();
                }

                // Handle a POST, which we'll receive as an AJAX request (per the image uploader component)
                // We reply with a 200 regardless of result, check the ok prop on the frontend to decide how to react (ok convention bic'd from fetch API)

                // Failed payload processing and/or validation
                if (request.app.formValidation) {
                    return reply({
                        ok: false,
                        errors: request.app.formValidation
                    }).takeover();
                }

                const { id: userId } = request.auth.credentials;
                const { validation, ...post } = request.payload;

                return Promise.resolve()
                    .then(() => postService.create(userId, post))
                    .then((postId) => reply({ ok: true, postId }).takeover())
                    .catch((err) => {

                        request.app.formValidation = request.app.formValidation || [];

                        if (err instanceof postService.InvalidTownError) {

                            request.app.formValidation.push({
                                type: 'form',
                                path: 'town',
                                message: 'Sorry, you can\'t post to that town because you\'re not a member.'
                            });

                            return reply({
                                ok: false,
                                errors: request.app.formValidation
                            }).takeover();
                        }

                        if (err instanceof postService.BadImageFormatError) {

                            request.app.formValidation.push({
                                type: 'form',
                                path: 'image',
                                message: err.message
                            });

                            return reply({
                                ok: false,
                                errors: request.app.formValidation
                            }).takeover();
                        }

                        // Something has gone terribly, terribly wrong
                        // TODO This is currently triggered the case where the user submits an offer/wanted w/o a town (uncaught assertion err)
                        // Make sure that path no longer blows things up when we update post create to allow Friends-only OFFERS/WANTEDS
                        throw err;
                    });
            }
        ]
    }),
    handler(request, reply) {

        const { tagService, userService } = request.server;
        const { id: userId } = request.auth.credentials;

        return Promise.all([
            tagService.fetchAll(),
            userService.fetchTownMemberships(userId)
        ])
        .then(([tags, towns]) => {

            reply.view('home/post_new', {
                title: 'Make a Post',
                data: {
                    tags,
                    towns
                }
            });
        });
    }
};
