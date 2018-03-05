const Countries = require('../../assets/js/modules/countries');
const Regions = require('../../assets/js/modules/regions');

module.exports = {
    method: 'GET',
    path: '/find-towns',
    config: {
        id: 'find_groups',
        description: 'Search for towns.'
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

        reply.view('find-groups', {
            title: 'Find Towns',
            groupList,
            countries: Countries,
            regions: Regions,
            geomap: groupMap,
            inBodyAds: [
                'one',
                'two'
            ]
        });
    }
};
