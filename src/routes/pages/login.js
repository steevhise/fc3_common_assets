const Hoek = require('hoek');

module.exports = {
    method: '*',
    path: '/login',
    config: {
        id: 'pages_login',
        description: 'login on this page',
        auth: false,
        plugins: {
            crumb: {
                source: 'payload',
                cookieOptions: {
                    isSecure: false,
                    isHttpOnly: true
                }
            }
        }
    },
    handler: function (request, reply) {

        const { authService } = request.server;

        // if credentials are passed in from form...
        if (request.payload) {

            const { user: username, password } = request.payload;

            return authService.login(username, password)
            .then((user) => {

                if (!user) {
                    return reply.view('login', {
                        title: 'Login Required',
                        msg: 'Invalid username/email or password.'
                    });
                }

                return authService.grantToken(user.user_id, request.info.remoteAddress);
            })
            .then(({ user_id, token }) => {

                request.cookieAuth.set(user_id, token);

                request.log('debug', 'ok we gave out the cookie');

                const { redirect } = request.state;

                if (redirect) {
                    reply.unstate('redirect');
                }

                return reply.redirect((redirect && redirect.to) || '/home/dashboard').temporary(true);
            });
        }

        return reply.view('login', {
            title: 'Login Required'
        });
    }
};
