
const internals = {};

module.exports = {
    method: '*', // Must handle both GET and POST, per bell's docs
    path: '/fb-connect',
    config: {
        id: 'pages_fbconnect',
        description: 'Connect a Facebook account to an existing Freecycle account',
        tags: ['login', 'exclude'],
        auth: {
            strategy: 'facebook',
            mode: 'try' // Allows us to display a friendlier error response instead of our error page
            // cancelled FB auth throws a 500, which triggers failed auth, which skips handler; try allows us to proceed to handler even on failure
        }
    },
    handler: function (request, reply) {

        const { MyFreecycle: fcCookie } = request.state;

        // Require connecting user to have a valid a Freecycle cookie i.e. be authenticated on our side, too, not just FB
        if (!request.auth.isAuthenticated || !fcCookie) {
            reply.state('redirectedError', {
                type: 'data',
                message: 'Facebook connect failed or was cancelled (you may need to login to proceed)'
            });
            return reply.redirect('/login').temporary(); // To login b/c cookieless request to settings ends up on login anyway :)
        }

        const { authService, userService } = request.server;
        const facebookId = request.auth.credentials.profile.id;

        const token = fcCookie.slice(0, 32);
        const userId = Number(fcCookie.slice(32));

        return authService.verifyToken(userId, token)
        .then((authToken) => {

            if (!authToken) {
                throw new internals.UnauthrorizedFacebookConnectionError('Your session has expired. Please login to complete connecting your Facebook account');
            }

            return userService.fetchByIdentifier(userId);
        })
        .then((user) => {

            if (!user) {
                throw new Error('Issue with user accounts data. Please contact Freecycle administrator');
            }

            return authService.facebookConnect(user.user_id, facebookId);
        })
        .then(() => reply.redirect('/home/settings').temporary())
        .catch((err) => {

            if (err instanceof authService.UserAlreadyExistsError) {
                reply.state('redirectedError', {
                    type: 'data',
                    message: 'Sorry, that Facebook account is already connected to a Freecycle account'
                });
                return reply.redirect('/home/settings').temporary();
            }

            if (err instanceof internals.UnauthrorizedFacebookConnectionError) {
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

internals.UnauthrorizedFacebookConnectionError = class UnauthrorizedFacebookConnectionError extends Error {};
