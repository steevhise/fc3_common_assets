const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/styleguide',
    config: {
        id: 'pages_styleguide',
        description: 'this is a demonstration page of all the componenets of the site.'
    },
    handler: function (request, reply) {

        reply.view('index', {
            friends: Mocks.friends,
            title: 'The Styleguide',
            posts: Mocks.posts
        });
    }
};
