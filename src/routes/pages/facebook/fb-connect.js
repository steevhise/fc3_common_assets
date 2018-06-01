
module.exports = {
    method: '*', // Must handle both GET and POST, per bell's docs
    path: '/fb-connect',
    config: {
        id: 'pages_fbconnect',
        description: 'Log in via FB',
        tags: ['login', 'exclude'],
        auth: 'facebook'
    },
    handler: function (request, reply) {

        if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
        }

        const { authService } = request.server;
        const facebookId = request.auth.credentials.profile.id;
        const { userId } = request.auth.credentials.query;

        return authService.facebookConnect(userId, facebookId)
        .then(() => reply.redirect('/home/settings').temporary())
        .catch((err) => {

            if (err instanceof authService.UserAlreadyExistsError) {
                reply.state('redirectedError', {
                    type: 'data',
                    message: 'Sorry, that account is already connected to a Freecycle account'
                });
                return reply.redirect('/home/settings').temporary();
            }

            throw err;
        });
    }
};
