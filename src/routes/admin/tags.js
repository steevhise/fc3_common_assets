const Boom = require('boom');
const Joi = require('joi');
const { PRIV_ADMIN_CONTROL_CENTER } = require('../scopes');
const RouteHelpers = require('../helpers');

const internals = {};

module.exports = {
    method: '*',
    path: '/admin/tags/{id?}',
    config: {
        id: 'admin_tags',
        description: 'Create, edit, and delete system tags',
        auth: {
            mode: 'required',
            scope: PRIV_ADMIN_CONTROL_CENTER
        },
        validate: {
            failAction: RouteHelpers.formFailAction,
            params: {
                id: [Joi.number().integer(), Joi.string()] // Accepts tag id or tag name
            },
            query: { // Prevent delete success from displaying when trying to create on /admin/tags?deleted
                deleted: Joi.alternatives().when(Joi.ref('$payload.name'), { is: Joi.exist(), then: Joi.strip(), otherwise: Joi.boolean().truthy('', '1').valid(true) })
            },
            payload: Joi.alternatives()
                .when(
                    Joi.object({ delete: Joi.exist() }),
                {
                    then: Joi.object({
                        id: Joi.number().integer().required(),
                        delete: Joi.boolean().truthy('delete').valid(true)
                    }),
                    otherwise: Joi.object({
                        id: Joi.number().integer().when(Joi.ref('$params.id'), { is: Joi.exist(), then: Joi.required() }),
                        name: Joi.string().regex(/^\d+$/, { invert: true }).max(64).required().label('Tag Name') // TODO Any limitation on tag name length?
                    })
                }),
            options: {
                abortEarly: false,
                language: {
                    key: '{{!key}} field ',
                    string: {
                        regex: {
                            invert: {
                                base: 'must be an alphanumeric string w/ at least 1 letter'
                            }
                        }
                    }
                }
            }
        },
        pre: [
            (request, reply) => {

                const { server: { tagService }, params, payload, auth } = request;

                if (!payload || payload.validation) {
                    return reply();
                }

                if (!params.id) {

                    return Promise.resolve()
                    .then(() => tagService.create(auth.credentials.id, payload.name))
                    .then((tagId) => {

                        return reply.redirect(`/admin/tags/${tagId}`).temporary().takeover();
                    })
                    .catch((err) => internals.handleUniquenessError(request, reply, err))
                    // Entirely paranoia; form and input validation should always prevent tag name input from triggering name length errors in the service layer
                    .catch((err) => internals.handleNameLengthError(request, reply, err))
                    .catch(reply);
                }

                if (payload.delete) {
                    return tagService.delete(payload.id)
                    .then((deleted) => {

                        if (!deleted) {
                            throw Boom.notFound('Tag not found');
                        }

                        return reply.redirect('/admin/tags?deleted').temporary().takeover();
                    })
                    .catch(reply);
                }

                return Promise.resolve()
                .then(() => tagService.update(payload.id, payload.name))
                .then((updated) => {

                    if (!updated) {
                        throw Boom.notFound('Tag not found');
                    }

                    return reply();
                })
                .catch((err) => internals.handleUniquenessError(request, reply, err))
                .catch((err) => internals.handleNameLengthError(request, reply, err))
                .catch(reply);
            },
            [{
                assign: 'tag',
                method: (request, reply) => {

                    const { server: { tagService }, params: { id: tagId } } = request;

                    if (!tagId) {
                        return reply(null);
                    }

                    return tagService.fetch(tagId, { admin: true, postCount: true })
                    .then((tag) => {

                        if (!tag) {
                            throw Boom.notFound('Tag not found');  // TODO Test this branch
                        }

                        return reply(tag);
                    })
                    .catch(reply);
                }
            },
            {
                assign: 'allTags',
                method: (request, reply) => {

                    const { server: { tagService } } = request;

                    return tagService.fetchAll()
                        .then(reply).catch(reply);
                }
            }]
        ]
    },
    handler: (request, reply) => {

        const { pre: { tag, allTags }, payload, query } = request;
        const { validation, ...submitted } = payload || {};

        // Remove invalid POST data
        if (validation) {
            validation.info.forEach(({ path }) => {

                delete submitted[path];
            });
        }

        reply.view('admin/tags', {
            title: 'Administrate Tags',
            data: {
                tag: tag ? Object.assign({}, tag, submitted) : null,
                allTags,
                deleted: !!query.deleted
            }
        });
    }
};

internals.handleNameLengthError = (request, reply, err) => {

    const { tagService } = request.server;

    if (err instanceof tagService.TagNameTooLongError) {

        request.app.formValidation = request.app.formValidation || [];
        request.app.formValidation.push({
            type: 'data',
            field: 'name',
            message: 'That tag name is too long. Tags must be 64 characters or less'
        });

        return reply();
    }

    throw err;
};

internals.handleUniquenessError = (request, reply, err) => {

    const { tagService } = request.server;

    if (err instanceof tagService.TagAlreadyExistsError) {
        request.app.formValidation = request.app.formValidation || [];
        // Only possible source of unique constraint violation is tag name
        request.app.formValidation.push({
            type: 'data',
            field: 'name',
            message: `That tag (${err.fields.tag_name}) already exists`
        });

        return reply();
    }

    throw err;
};
