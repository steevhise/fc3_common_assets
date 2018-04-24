const Joi = require('joi');
const Boom = require('boom');
const RouteHelpers = require('../helpers');

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
                    .items(
                        Joi.binary().min(1)
                    )
                    .max(postService.MAX_POST_IMAGES)
                    // one of the empty schemas is an empty object because the route's configured multipart processing outputs an empty object
                    // when no images are sent in the payload AND the form's encoding is multipart/form-data (enctype="multipart/form-data") (which it is and needs to be to upload image files)
                    // If the form is not encoded thusly, the output of an empty images input is an empty Buffer. Not sure what this means, just felt it was odd/worth noting :)
                    .empty({}, '', null)        // TODO disallow images for certain types?
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
            (request, reply) => {

                if (!request.payload) {
                    return reply.continue();
                }

                // Handle a POST

                // Failed validation
                if (request.payload.validation) {
                    return reply.continue();
                }

                const { postId } = request.params;
                const { id: userId } = request.auth.credentials;

                return postService.update(postId, userId, request.payload)
                .then(() => {

                    return reply.redirect(`/posts/${postId}`).temporary().takeover();
                });
            }
        ],
        ext: {
            onPreResponse: {
                method(request, reply) {

                    if (!request.response.isBoom) {
                        return reply.continue();
                    }

                    const err = request.response;
                    const { postService } = request.server;

                    /*
                    TODO handle each error from update()
                    // Only post author can edit a post
                    if (userId !== post.user.id) {
                        request.log('authorization', 'post author id is ' + post.user.id + ' but current user is ' + userId);
                        const path = request.route.path.replace('{postId}', postId);

                        reply.state('redirectedError', {
                            message: 'You\'re not allowed to edit other users\' posts',
                            path,
                            type: 'postEditForbidden'
                        });
                        return reply.redirect(`/posts/${postId}`).temporary().takeover();
                    }
                    */

                    return reply.continue();
                }
            }
        }
    }),
    handler: (request, reply) => {

        const { postService } = request.server;
        const { id: userId } = request.auth.credentials;
        const { postId } = request.params;

        return Promise.all([
            postService.fetchForUpdate(postId, userId),
            postService.fetchTags()
        ])
        .then(([post, tags]) => {

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
