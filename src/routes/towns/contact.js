const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/town/contact/{uniqueName}',
    config: {
        id: 'groups_contact',
        description: 'The named town\'s contact.'
    },
    handler: function (request, reply) {

        reply.view('groups/contact', {
            group: Mocks.group,
            inBodyAds: [
                'one',
                'two'
            ]
        });
    }
};
