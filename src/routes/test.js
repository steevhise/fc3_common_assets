const Boom = require('boom');

// route just to test that Boom messages get percolated all the way to the template.
module.exports = [
    {
        method: 'GET',
        path: '/test',
        config: {
            description: 'Just a test.',
            id: 'pages_test',
            auth: { mode: 'required' }
        },
        handler:  (request, reply) => {

            return reply(Boom.create(499, 'testing testing'));
        }
    }
];
