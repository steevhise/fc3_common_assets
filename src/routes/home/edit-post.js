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
                // TODO Need to require? Fails if not supplied b/c
                // Post.entity expects this to exist, I think...?
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
            {
                // 'post' is the key on request.pre to which the return value of method is assigned
                // return value is only ever the post data loaded via fetchByIdentifier (just GET or invalid POST requests)
                assign: 'post',
                method: (request, reply) => {

                    const { id: userId } = request.auth.credentials;
                    const { postId } = request.params;

                    return postService.fetchByIdentifier(postId, { viewerId: userId })
                    .then((post) => {

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

                        // Handle a GET OR failed validation (in either case, we're onto the handler)
                        if (!request.payload || request.payload.validation) {
                            // In prerequisites, reply interface with a value assigns the value
                            // to request.pre, does NOT send value to the client (inconsistency explained here: https://github.com/hapijs/hapi/blob/v16/API.md#route-prerequisites)
                            // TODO What key of request.pre is this assigned to?
                            return reply(post);
                        }

                        // Handle a POST
                        // TODO Need to kick off w/ Promise.resolve()?
                        // TODO Safe to pass payload directly?
                        return Promise.resolve()
                        .then(() => postService.update(userId, postId, request.payload))
                        .then((postId) => reply.redirect(`/posts/${postId}`).temporary().takeover())
                        .catch((err) => {

                            // TODO Actually handle cases, ya turkey
                            return reply(err);
                        });
                    });
                }
            }
        ]
    }),
    handler: (request, reply) => {

        // GOAL: Delivering post data, DATA OF THE CURRENT POST, to the frontend
        // TODO On error, revert to current val
        // TODO On error, send back ok values

        const { userService, postService } = request.server;
        const { id: userId } = request.auth.credentials;
        const { post } = request.pre;

        return Promise.all([
            postService.fetchTags(),
            userService.fetchTownMemberships(userId)
        ])
        .then(([tags, towns]) => {

            reply.view('home/post_edit', {
                data: {
                    post,
                    title: `Edit Post : ${post.id}`,
                    towns,
                    tags
                },
                inBodyAds: [
                    'one', 'two'
                ]
            });
        });
    }
};
