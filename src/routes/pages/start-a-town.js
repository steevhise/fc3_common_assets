const Countries = require('../../assets/js/modules/countries');

module.exports = {
    method: 'GET',
    path: '/startatown',
    config: {
        id: 'start_a_group',
        auth: { mode: 'required' },
        description: 'Apply to start a new town'
    },
    handler: function (request, reply) {

        reply.view('start_a_group', {
            title: 'Start a Town',
            countries: Countries
        });
    }
};
