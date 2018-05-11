
const internals = {};

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

        const { authService } = request.server; // TODO , alertService

        // if credentials are passed in from form...
        if (request.payload) {

            const { user: username, password } = request.payload;

            return authService.login(username, password)
            .then((user) => {

                if (!user) {
                    throw new internals.LoginRequired();
                }

                return Promise.all([
                    authService.grantToken(user.user_id, request.info.remoteAddress),
                    Promise.resolve(5) // TODO alertService.countForUser(user.user_id)
                ]);
            })
            .then(([{ user_id, token }, alertCount]) => {

                request.cookieAuth.set(user_id, token);

                request.log('debug', 'ok we gave out the cookie');

                reply.state('alertCount', `${alertCount}`); // unencoded cookies must be strings


                // See also pre on routes/pages/start-a-town.js
                // Might need to login while moving from step2 to step3 of create-a-town

                const { startATown } = request.state;
                const { step2 } = request.payload;

                if (startATown && startATown.step1 && typeof step2 !== 'undefined') {
                    if (step2) {
                        reply.state('startATown', { step2: true });
                    }
                    return reply.redirect('/startatown').temporary(true);
                }

                // Use redirect

                const { redirect } = request.state;

                if (redirect) {
                    reply.unstate('redirect');
                }

                return reply.redirect((redirect && redirect.to) || '/home/dashboard').temporary(true);
            })
            .catch((err) => {

                if (err instanceof internals.LoginRequired) {
                    return reply.view('login', {
                        title: 'Login Required',
                        msg: 'Invalid username/email or password.'
                    });
                }

                throw err;
            });
        }

        return reply.view('login', {
            title: 'Login Required'
        });
    }
};

internals.LoginRequired = class LoginRequired extends Error {};
