const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/town/announcements/{uniqueName}',
    config: {
        id: 'groups_announcements',
        description: 'The named town\'s announcements.'
    },
    handler: function (request, reply) {

        reply.view('groups/announcements', {
            group: Mocks.group,
            inBodyAds: [
                'one',
                'two'
            ]
        });
    }
};
