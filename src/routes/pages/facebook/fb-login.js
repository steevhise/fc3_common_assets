
module.exports = {
    method: '*', // Must handle both GET and POST, per bell's docs
    path: '/fb-login',          // The callback endpoint registered with facebook
    config: {
        id: 'pages_fblogin',
        description: 'Log in via FB',
        tags: ['login', 'exclude'],
        auth: {
            strategy: 'facebook',
            mode: 'try' // Allows us to display a friendlier error response instead of our error page
            // cancelled FB auth throws a 500, which triggers failed auth, which skips handler; try allows us to proceed to handler even on failure
        }
    },
    handler: function (request, reply) {

        if (!request.auth.isAuthenticated) {
            reply.state('redirectedError', {
                type: 'data',
                message: 'Facebook login failed or was cancelled'
            });
            return reply.redirect('/login').temporary();
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
