const Joi = require('joi');
const Boom = require('boom');
const RouteHelpers = require('../helpers');

const internals = {};

module.exports = {
    method: '*',
    path: '/home/edit-post/{postId}',
    config: ({ postService }) => ({
        id: 'home_post_edit',
        description: 'Edit a post',
        auth:  { mode: 'required' },
        payload: {
            // processes any input from the images field into Buffers representing the image files in memory
            multipart: { output: 'data' },
            maxBytes: 1048576 * postService.MAX_POST_IMAGES, // 1mb per image
            failAction: (request, reply, error) => {

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
            params: Joi.object({
                postId: Joi.number().integer()
            }),
            payload: Joi.object({
                subject: Joi.string()
                    .required()
                    .label('Title'),
                description: Joi.string()
                    .required()
                    .label('Description'),
                type: Joi.number()
                    .valid([
                        postService.TAKEN,
                        postService.RECEIVED
                    ])
                    .label('Type'),
                location: Joi.string()
                    .empty('')
                    .label('Crossroads'),
                images: Joi.array()
                    // Handles the case of 1 valid upload
                    .single()
                    .items(Joi.binary().min(1))
                    .max(postService.MAX_POST_IMAGES)
                    // one of the empty schemas is an empty object because the route's configured multipart processing outputs an empty object
                    // when no images are sent in the payload AND the form's encoding is multipart/form-data (enctype="multipart/form-data") (which it is and needs to be to upload image files)
                    // If the form is not encoded thusly, the output of an empty images input is an empty Buffer. Not sure what this means, just felt it was odd/worth noting :)
                    .empty({}, '', null)        // TODO disallow images for certain types?
                    .label('Post images (newly uploaded)'),
                deletedImages: Joi.array()
                    .single()
                    .items(Joi.number().integer())
                    .max(postService.MAX_POST_IMAGES)
                    .empty({}, '', null)
                    .label('Deleted previously uploaded post images '),
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

                const { postId } = request.params;
                const { id: userId } = request.auth.credentials;

                return postService.update(postId, userId, request.payload)
                .catch(internals.handleUpdateError(request))
                .then(() => {

                    if (request.app.formValidation && request.app.formValidation.length) {
                        return reply({
                            ok: false,
                            errors: request.app.formValidation
                        }).takeover();
                    }

                    return reply({ ok: true, postId }).takeover();
                });
            }
        ]
    }),
    handler: (request, reply) => {

        const { postService } = request.server;
        const { id: userId } = request.auth.credentials;
        const { postId } = request.params;

        return Promise.all([
            postService.fetchForUpdate(postId, userId)
                .catch(internals.handleUpdateError(request)),
            postService.fetchTags()
        ])
        .then(([post = {}, tags]) => {

            // Rename "group" to "town"

            const { group, ...others } = post;

            post = {
                ...others,
                town: group
            };

            reply.view('home/post_edit', {
                data: {
                    title: 'Edit Post',
                    post,
                    tags
                },
                inBodyAds: [
                    'one', 'two'
                ]
            });
        });
    }
};

internals.handleUpdateError = (request) => {

    return (err) => {

        const { postService } = request.server;

        if (err instanceof postService.PostNotFoundError) {
            throw Boom.notFound('Post not found');
        }

        if (err instanceof postService.PostRejectedError) {
            throw Boom.notFound('Sorry, your post was rejected');
        }

        if (err instanceof postService.PostClosedError) {
            throw Boom.notFound('That post is closed');
        }

        if (err instanceof postService.PostOwnershipError) {
            throw Boom.notFound('Post not found');
        }

        request.app.formValidation = request.app.formValidation || [];

        if (err instanceof postService.PostTypeError) {
            request.app.formValidation.push({
                type: 'form',
                path: 'type',
                message: err.message
            });

            return;
        }

        if (err instanceof postService.CheckHotwordsError) {
            request.app.formValidation.push({
                type: 'form',
                message: 'Your post seems to contain content that violates our terms of service.'
            });

            return;
        }

        throw err;
    };
};
