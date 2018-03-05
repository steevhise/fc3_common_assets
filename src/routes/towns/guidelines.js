const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/town/guidelines/{unique_group_name}',
    config: {
        id: 'groups_guidelines',
        description: 'The named group\'s guidelines.'
    },
    handler: function (request, reply) {

        const inBodyAds = [
            'one',
            'two'
        ];
        reply.view('./groups/guidelines', {
            inBodyAds,
            group: Mocks.group
        });
    }
};
