module.exports = {
    method: 'GET',
    path: '/logout',
    config: {
        id: 'pages_logout',
        description: 'Log out on this page, delete your cookie',
        auth: false,
        handler: function (request, reply) {

            request.cookieAuth.clear();

            reply.unstate('location');

            return reply.redirect('/').temporary();
        }
    }
};
