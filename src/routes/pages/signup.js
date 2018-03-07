module.exports = {
    method: '*',
    path: '/signup',
    config: {
        id: 'pages_signup',
        description: 'Signup on this page',
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

        const msg = null;
        // if credentials are passed in from form...
        //     TODO: if user is already logged in, redirect them to their dashboard....
        if (request.payload && request.payload.user && request.payload.password) {
            // const user = request.payload.user;
            // const pw = request.payload.password;
            //
            // console.log(request.payload.crumb);
            //
            // request.server.methods.loginUser(user, pw, request.server, (err, userId) => {   // callback neccessary, i guess.???
            //
            //     Hoek.assert(!err, 'loginUser ERROR: ' + err);
            //     console.log('userID found after login:', userId);
            //     if (userId) {
            //         reply.setCookie(Number(userId), (err, cookieContent) => {
            //
            //             Hoek.assert(!err, 'Error: ' + err);
            //
            //             // or success
            //             reply.state('MyFreecycle', cookieContent);
            //             request.log('debug', 'ok we gave out the cookie', cookieContent);
            //             reply.redirect('/home/dashboard').temporary(true);
            //         });
            //     }
            //     else {
            //         // bad login.
            //         msg = 'invalid username/email or password.';
            //         reply.view('login', {
            //             title: 'Login Required',
            //             msg
            //         });
            //     }
            // });
        }
        else {
            reply.view('signup', {
                title: 'Signup for Freecycle',
                msg
            });
        }
    }
};
