const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/town/{uniqueName}',
    config: {
        id: 'groups_main',
        description: 'A town page, for example try /town/freecycle'
    },
    handler: function (request, reply) {

        const { uniqueName } = request.params;

        request.log('debug', 'about to look up group ' + uniqueName);

        reply.view('groups/group', {
            showFilterSelectors: true,
            isGroup: true,
            group: Mocks.group,
            posts: Mocks.group.posts,
            groups: [
                'Tuscon', 'Marana', 'Oro Valley', 'Vail', 'Sanuarita'
            ],
            inBodyAds: [
                'one',
                'two'
            ]
        });
    }
};
