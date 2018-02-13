const Url = require('url');

const internals = {};

module.exports = {
    type: 'onPreResponse',
    method: (request, reply) => {

        const { isAuthenticated, mode } = request.auth;
        const { headers } = request.response;
        const { path, method } = request;
        const { referrer, host } = request.info;

        // If the user lands on /login from some other freecycle domain,
        // remember where they came from.

        if (path === '/login' && method === 'get' && !isAuthenticated && referrer) {

            const { host: referredHost } = Url.parse(referrer);

            // Referred from a different freecycle domain (e.g. modtools)

            if (internals.hostOnFreecycle(referredHost) && (referredHost !== host)) {
                reply.state('redirect', { to: referrer });
            }
        }

        // If the user got redirected to /login on an auth'd endpoint,
        // remember where they were trying to go.

        if (headers.location === '/login' && !isAuthenticated && mode === 'required') {
            reply.state('redirect', { to: request.url.path });
        }

        // If for whatever reason the user is logged-in and has this cookie, clear it

        if (request.state.redirect && isAuthenticated) {
            reply.unstate('redirect');
        }

        return reply.continue();
    },
    options: {
        sandbox: 'plugin'
    }
};

internals.hostOnFreecycle = (host) => (/(?:^|\.)freecycle\.org(?::[\d]{2,4})?$/).test(host);
