const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/styleguide',
    config: {
        id: 'pages_styleguide',
        description: 'Demonstration page of all the components of the site.'
    },
    handler: function (request, reply) {

        reply.view('index', {
            friends: Mocks.friends,
            title: 'The Styleguide',
            posts: Mocks.posts
        });
    }
};
