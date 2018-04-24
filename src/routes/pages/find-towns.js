const Gql = require('@freecycle/common-hapi-plugins/modules/graphql-wrapper');
const Countries = require('../../assets/js/modules/countries');
const Regions = require('../../assets/js/modules/regions');

const internals = {};

module.exports = {
    method: 'GET',
    path: '/find-towns',
    config: {
        id: 'find_groups',
        description: 'Search for towns.',
        pre: [
            {
                assign: 'groups',
                method: (request, reply) => {

                    return internals.fetchAllGroupLocations({
                        where: {
                            deleted: false,
                            nga_approved: true,
                            $or: {
                                latitude: { $ne: 0 },
                                longitude: { $ne: 0 }
                            }
                        }
                    })
                    .then(({ groups }) => groups)
                    .then(reply, reply);
                }
            }
        ]
        // TODO Note that on /town/{{id}} (routes/towns/main.js), when a searched town has no set coordinates (lat, lng = 0,0)
        // We display a button that links to this page, setting the query string
        // QUESTION What do we need from that query to search for a given town's region? Will need to update other route and group templates accordingly
    },
    handler: function (request, reply) {

        const groupList = [
            {
                name: 'Chandler',
                state: 'AZ',
                distance: 0
            },
            {
                name: 'Ahwatukee',
                state: 'AZ',
                distance: 15
            },
            {
                name: 'Peoria',
                state: 'AZ',
                distance: 40
            },
            {
                name: 'Tucson',
                state: 'AZ',
                distance: 100
            },
            {
                name: 'Dewey-Humboldt',
                state: 'AZ',
                distance: 107
            },
            {
                name: 'Lake Havasu City',
                state: 'AZ',
                distance: 225
            }
        ];

        const groupMap = {
            settings: {
                height: '400',
                width: '100%'
            },
            markers: [
                { lat : 33.306329, lng : -111.840852, description : 'Chandler', icon: 'group' },
                { lat : 33.342573, lng : -111.983492, description : 'Ahwaktukee', icon: 'user' },
                { lat : 33.581569, lng : -112.240584, description : 'Peoria', icon: 'post' },
                { lat : 32.218476, lng : -110.905825, description : 'Tucson', icon: 'post' },
                { lat : 34.505731, lng : -112.242147, description : 'Dewey-Humboldt', icon: 'post' },
                { lat : 34.482473, lng : -114.322985, description : 'Lake Havasu City', icon: 'post' }
            ]
        };

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
            data: request.pre,
            groupList,
            countries: Countries,
            regions: Regions,
            geomap: groupMap,
            inBodyAds: [
                'one',
                'two'
            ],
            errors
        });
    }
};

internals.fetchAllGroupLocations = Gql.buildQuery(`
    query ($where: SequelizeJSON!) {
        groups(where: $where) {
            id: group_id
            name: group_name
            latitude
            longitude
        }
    }
`);
