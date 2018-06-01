
module.exports = {
    method: '*', // Must handle both GET and POST, per bell's docs
    path: '/fb-login',          // The callback endpoint registered with facebook
    config: {
        id: 'pages_fblogin',
        description: 'Log in via FB',
        tags: ['login', 'exclude'],
        auth: 'facebook'
    },
    handler: function (request, reply) {

        // TODO Check if this is needed?
        if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
        }

        const { authService } = request.server;
        const facebookId = request.auth.credentials.profile.id;

        return authService.facebookLogin(facebookId)
        .then((userId) => {

            return authService.grantToken(userId, request.info.remoteAddress);
        })
        .then(({ user_id: userId, token }) => {

            // Set standard cookie
            request.cookieAuth.set(userId, token);

            // See also pre on routes/pages/start-a-town.js
            // Might need to login while moving from step2 to step3 of create-a-town

            const { startATown } = request.state;
            // bell places query of initial request (Before redirect to and from FB Oauth endpoint) in this object
            // we create that query data in the Vue Login component
            const { step2 } = request.auth.credentials.query;

            if (startATown && startATown.step1 && typeof step2 !== 'undefined') {
                if (step2) {
                    reply.state('startATown', { step2: true });
                }
                return reply.redirect('/startatown').temporary();
            }

            // Use redirect

            const { redirect } = request.state;

            if (redirect) {
                reply.unstate('redirect');
            }

            return reply.redirect((redirect && redirect.to) || '/home/dashboard').temporary();
        })
        .catch((err) => {

            if (err instanceof authService.UserDoesNotExistError) {
                reply.state('redirectedError', {
                    type: 'data',
                    message: err.message
                });
                return reply.redirect('/login').temporary();
            }

            throw err;
        });
    }
};
