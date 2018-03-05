const Boom = require('boom');

// route just to test that Boom messages get percolated all the way to the template.
module.exports = [
    {
        method: 'GET',
        path: '/test',
        config: {
            description: 'Just a test.',
            id: 'pages_test',
            auth: { mode: 'required' },
            plugins: {
                // 'hapiAuthorization': {role: '1'}
                // you don't have to have any special privs to see your own dashboard, but this is how you do it.
            }
        },
        handler:  (request, reply) => {

            return reply(Boom.create(499, 'testing testing'));
        }
    }
];
