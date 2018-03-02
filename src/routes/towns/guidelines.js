const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/town/guidelines/{uniqueName}',
    config: {
        id: 'groups_guidelines',
        description: 'The named town\'s guidelines.'
    },
    handler: function (request, reply) {

        reply.view('groups/guidelines', {
            group: Mocks.group,
            inBodyAds: [
                'one',
                'two'
            ]
        });
    }
};
