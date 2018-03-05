module.exports = {
    method: 'GET',
    path: '/logout',
    config: {
        id: 'pages_logout',
        description: 'log out on this page, delete your cookie',
        auth: false,
        handler: function (request, reply) {

            request.cookieAuth.clear();
            reply.view('logout', {
                title: 'Logged out'
            });
        }
    }
};
