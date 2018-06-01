
module.exports = {
    method: 'GET',
    path: '/fb-signup',
    config: {
        id: 'pages_fbsignup',
        description: 'Signup in via FB',
        tags: ['exclude'],
        auth: 'facebook'
    },
    handler: (request, reply) => {

        // Handle auth errors TODO Do we end up here if user cancels facebook dialog?
        // NOTE Uncaught 500 if you hit back once you arrive at dialog...hmmm
        if (!request.auth.isAuthenticated) {
            return reply(`Authentication failed due to: ${request.auth.error.message}`);
        }

        const { authService } = request.server;
        const { profile } = request.auth.credentials;

        return authService.facebookSignup({
            firstName: profile.name.first,
            lastName: profile.name.last,
            email: profile.email,
            facebookId: profile.id
        })
        .then((userId) => {

            return authService.grantToken(userId, request.info.remoteAddress);
        })
        .then(({ user_id: userId, token }) => {

            // Set standard cookie
            request.cookieAuth.set(userId, token);

            // Redirect to signup page w/ success!
            return reply.redirect('/signup?facebook=success').temporary();
        })
        .catch((err) => {

            if (err instanceof authService.UserAlreadyExistsError) {

                const field = err.fields.email ? 'email address' : 'Facebook account'; // For reference, FB field is titled uniq_facebook_id

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
