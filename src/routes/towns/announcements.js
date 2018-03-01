const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/town/announcements/{unique_group_name}',
    config: {
        id: 'groups_announcements',
        description: 'The named town\'s announcements.'
    },
    handler: function (request, reply) {

        const inBodyAds = [
            'one',
            'two'
        ];
        reply.view('./groups/announcements', {
            inBodyAds,
            group: Mocks.group
        });
    }
};
