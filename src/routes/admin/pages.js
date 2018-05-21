const Joi = require('joi');
const Boom = require('boom');
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
            params: {
                id: Joi.number().integer()
            }
        },
        pre: [
            {
                assign: 'pageId',
                method: (request, reply) => {

                    const { server: { pageService }, params, payload, auth } = request;

                    if (!payload) {
                        return reply(params.id);
                    }

                    if (!params.id) {
                        return pageService.create(auth.credentials.id, request.payload)
                            .then((pageId) => reply(pageId)).catch(reply);
                    }

                    return pageService.update(params.id, auth.credentials.id, request.payload)
                    .then((updated) => {

                        if (!updated) {
                            throw Boom.notFound('Page not found');
                        }

                        return reply(params.id)
                    })
                    .catch(reply);
                }
            },
            [{
                assign: 'page',
                method: (request, reply) => {

                    const { server: { pageService }, pre: { pageId } } = request;

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

        const { pre: { page, allPages } } = request;

        reply.view('admin/pages', {
            title: 'Administrate Pages',
            data: {
                page,
                allPages
            }
        });
    }
};
