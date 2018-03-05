const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/town/{unique_group_name}',
    config: {
        id: 'groups_main',
        description: 'a town page, for example try /town/freecycle'
    },
    handler: function (request, reply) {

        const inBodyAds = [
            'one',
            'two'
        ];

        const unique_name = request.params.unique_group_name;
        request.log('debug', 'about to look up group ' + unique_name);

        reply.view('./groups/group.html', {
            inBodyAds,
            group: Mocks.group,
            showFilterSelectors: true,
            isGroup: true,
            posts: Mocks.group.posts,
            groups: [
                'Tuscon', 'Marana', 'Oro Valley', 'Vail', 'Sanuarita'
            ]
        });
    }
};
