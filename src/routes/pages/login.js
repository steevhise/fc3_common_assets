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

        let msg = null;

        // if credentials are passed in from form...
        if (request.payload && request.payload.user && request.payload.password) {
            const user = request.payload.user;
            const pw = request.payload.password;

            request.server.methods.loginUser(user, pw, request.server, (err, userId) => {   // callback neccessary, i guess.???

                if (err) {
                    return reply(err);
                }

                if (userId) {
                    reply.setCookie(Number(userId), (err, cookieContent) => {

                        if (err) {
                            return reply(err);
                        }

                        // or success
                        reply.state('MyFreecycle', cookieContent);
                        request.log('debug', 'ok we gave out the cookie', cookieContent);

                        const { redirect } = request.state;

                        if (redirect) {
                            reply.unstate('redirect');
                        }

                        reply.redirect((redirect && redirect.to) || '/desktop-dash').temporary(true);
                    });
                }
                else {
            // bad login.
                    msg = 'invalid username/email or password.';
                    reply.view('login', {
                        title: 'Login Required',
                        msg
                    });
                }
            });
        }
        else {
            reply.view('login', {
                title: 'Login Required',
                msg
            });
        }
    }
};
