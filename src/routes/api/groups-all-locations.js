const Joi = require('joi');

const internals = {};

module.exports = {
    method: 'get',
    path: '/api/groups/location',
    config: {
        tags: ['api'],
        handler(request, reply) {

            const { groupService } = request.server;

            return groupService.fetchAllWithLocationInfo()
            .then((results) => {

                return reply({
                    total: results.groups.length,
                    ...results
                });
            });
        }
    }
};
