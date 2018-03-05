const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/town/contact/{unique_group_name}',
    config: {
        id: 'groups_contact',
        description: 'The named town\'s guidelines.'
    },
    handler: function (request, reply) {

        const inBodyAds = [
            'one',
            'two'
        ];
        reply.view('./groups/contact', {
            inBodyAds,
            group: Mocks.group
        });
    }
};
