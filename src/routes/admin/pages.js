const Joi = require('joi');
const Boom = require('boom');
const RouteHelpers = require('../helpers');
const { PRIV_ADMIN_CONTROL_CENTER } = require('../scopes');

module.exports = {
    method: '*',
    path: '/admin/pages/{id?}',
    config: {
        id: 'admin_pages',
        description: 'Create and edit "static" pages.',
        auth: {
            mode: 'required',
            scope: PRIV_ADMIN_CONTROL_CENTER
        },
        validate: {
            failAction: RouteHelpers.formFailAction,
            params: {
                id: Joi.number().integer()
            },
            payload: Joi.object({
                title: Joi.string()
                    .required()
                    .label('Title'),
                path: Joi.string()
                    .uri({ relativeOnly: true })
                    .regex(/^\//, { invert: true })
                    .required()
                    .label('Path')
                    .options({
                        language: {
                            string: {
                                regex: { invert: { base: 'cannot start with a "/"' } }
                            }
                        }
                    }),
                content: Joi.string()
                    .required()
                    .label('Page content'),
                published: Joi.boolean()
                    .truthy('1')
                    .default(false)
                    .label('Published')
            }),
            options: {
                abortEarly: false,
                language: {
                    key: '{{!key}} field '
                }
            }
        },
        pre: [
            (request, reply) => {

                const { server: { pageService }, params, payload, auth } = request;

                if (!payload || payload.validation) {
                    return reply();
                }

                const handleUniquenessError = (err) => {

                    if (err instanceof pageService.PageAlreadyExistsError) {
                        request.app.formValidation = request.app.formValidation || [];

                        Object.keys(err.fields).forEach((field) => {

                            field = field.startsWith('title') ? 'title' :
                                (field.startsWith('path') ? 'path' : null);

                            request.app.formValidation.push({
                                type: 'data',
                                field,
                                message: field ? `A page with that ${field} already exists` : 'That page already exists'
                            });
                        });

                        return reply();
                    }

                    throw err;
                };

                if (!params.id) {
                    return pageService.create(auth.credentials.id, request.payload)
                    .then((pageId) => {

                        return reply.redirect(`/admin/pages/${pageId}`).temporary().takeover();
                    })
                    .catch(handleUniquenessError)
                    .catch(reply);
                }

                return pageService.update(params.id, auth.credentials.id, request.payload)
                .then((updated) => {

                    if (!updated) {
                        throw Boom.notFound('Page not found');
                    }

                    return reply();
                })
                .catch(handleUniquenessError)
                .catch(reply);
            },
            [{
                assign: 'page',
                method: (request, reply) => {

                    const { server: { pageService }, params: { id: pageId } } = request;

                    if (!pageId) {
                        return reply(null);
                    }

                    return pageService.fetch(pageId)
                    .then((page) => {

                        if (!page) {
                            throw Boom.notFound('Page not found');
                        }

                        return reply(page)
                    })
                    .catch(reply);
                }
            },
            {
                assign: 'allPages',
                method: (request, reply) => {

                    const { server: { pageService } } = request;

                    return pageService.fetchAll()
                        .then(reply).catch(reply);
                }
            }]
        ]
    },
    handler: (request, reply) => {

        const { pre: { page, allPages }, payload } = request;
        const { validation, ...submitted } = payload || {};

        if (validation) {
            validation.info.forEach(({ path }) => {

                delete submitted[path];
            });
        }

        reply.view('admin/pages', {
            title: 'Administrate Pages',
            data: {
                page: Object.assign({}, page, submitted),
                allPages
            }
        });
    }
};
