const internals = {};

module.exports = {
    method: 'GET',
    path: '/find-towns',
    config: {
        id: 'find_groups',
        description: 'Search for towns.',
        pre: [
            {
                assign: 'groupsWithLocationInfo',
                method: (request, reply) => {

                    return request.server.groupService.fetchAllWithLocationInfo()
                    .then(reply, reply);
                }
            }
        ]
        // TODO Note that on /town/{{id}} (routes/towns/main.js), when a searched town has no set coordinates (lat, lng = 0,0)
        // We display a button that links to this page, setting the query string
        // QUESTION What do we need from that query to search for a given town's region? Will need to update other route and group templates accordingly
    },
    handler: function (request, reply) {

        // Handles the case where a user supplies an invalid group name to /town/{uniqueName},
        // which we handle by redirecting here with a cookie (redirectedError) describing the error
        const errors = [];

        if (request.state.redirectedError) {

            const { redirectedError } = request.state;

            if (redirectedError.type === 'groupNotFound') {
                errors.push({
                    message: redirectedError.message
                });
            }

            // Clean up the error cookie to ensure no fraudulent errors on subsequent visits in the session
            reply.unstate('redirectedError');
        }

        reply.view('find-groups', {
            title: 'Find Towns',
            data: {
                ...request.pre.groupsWithLocationInfo
            },
            inBodyAds: [
                'one',
                'two'
            ],
            errors
        });
    }
};
