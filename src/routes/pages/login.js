const Hoek = require('hoek');

module.exports = {
    method: '*',
    path: '/login',
    config: {
        id: 'pages_login',
        description: 'login on this page',
        auth: false,
        plugins: {
            // route specific options
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

        console.log('crumb: ' + request.plugins.crumb);

        let msg = null;
        // if credentials are passed in from form...
        if (request.payload && request.payload.user && request.payload.password) {
            const user = request.payload.user;
            const pw = request.payload.password;

            console.log(request.payload.crumb);

            request.server.methods.loginUser(user, pw, request.server, (err, userId) => {   // callback neccessary, i guess.???

                Hoek.assert(!err, 'loginUser ERROR: ' + err);
                console.log('userID found after login:', userId);
                if (userId) {
                    reply.setCookie(Number(userId), (err, cookieContent) => {

                        Hoek.assert(!err, 'Error: ' + err);

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
