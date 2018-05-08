const Joi = require('joi');

const internals = {};

module.exports = {
    method: 'get',
    path: '/api/groups/keywords',
    config: {
        tags: ['api'],
        validate: {
            query: {
                q: Joi.string(),
                page: Joi.number().integer().min(1).default(1),
                size: Joi.number().integer().min(1).default(25)
            }
        },
        handler(request, reply) {

            const { searchService, groupService } = request.server;
            const { q: keywords, page, size } = request.query;

            return searchService.groupsByKeywords(keywords)
            .then((results) => {

                const paginatedGroupIds = internals.paginate(results, { page, size });

                return Promise.all([
                    results.length,
                    groupService.fetchByIds(paginatedGroupIds)
                ]);
            })
            .then(([total, groups]) => {

                return reply({
                    total,
                    groups
                });
            });
        }
    }
};

internals.paginate = (results, { page, size }) => {

    const offset = size * (page - 1);

    return results.slice(offset, offset + size);
};
