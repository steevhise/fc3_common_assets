
module.exports = {
    method: '*', // Must support GET and POST
    path: '/fb-signup',
    config: {
        id: 'pages_fbsignup',
        description: 'Signup in via FB',
        tags: ['exclude'],
        auth: {
            strategy: 'facebook',
            mode: 'try' // Allows us to display a friendlier error response instead of our error page
            // cancelled FB auth throws a 500, which triggers failed auth, which skips handler; try allows us to proceed to handler even on failure
        }
    },
    handler: (request, reply) => {

        if (!request.auth.isAuthenticated) {
            reply.state('redirectedError', {
                type: 'data',
                message: 'Facebook login failed or was cancelled'
            });
            return reply.redirect('/signup').temporary();
        }

        const { authService } = request.server;
        const { profile } = request.auth.credentials;
        const { acceptedTerms, username } = request.auth.credentials.query; // Submitted as query params via sub-form in Signup.vue

        return authService.facebookSignup({
            firstName: profile.name.first,
            lastName: profile.name.last,
            email: profile.email,
            username,
            acceptedTerms,
            facebookId: profile.id
        })
        .then((userModel) => {

            // userModel may be either a UserStatic or User instance, depending on if
            // user already created an FC account with the email used on their FB account (we connect FB to existing Freecycle account --> UserStatic)
            return Promise.all([
                authService.grantToken(userModel.user_id, request.info.remoteAddress),
                userModel
            ]);
        })
        .then(([{ user_id: userId, token }, userModel]) => {

            // Set standard cookie
            request.cookieAuth.set(userId, token);

            // If we connected FB to existing FC account, we redirect as if user had just logged in
            const redirect = userModel.constructor === request.server.context.models.UserStatic ? '/home/dashboard' : '/signup?facebook=success';
            return reply.redirect(redirect).temporary();
        })
        .catch((err) => {

            if (err instanceof authService.UserAlreadyExistsError) {

                const field = err.fields.username ? 'Freecycle username' : (err.fields.email ? 'email address' : 'Facebook account'); // For reference, FB field is titled uniq_facebook_id

                reply.state('redirectedError', {
                    type: 'data',
                    message: `Sorry, that ${field} is already in use`
                });
                return reply.redirect('/signup').temporary();
            }

            throw err;
        });
    }
};
