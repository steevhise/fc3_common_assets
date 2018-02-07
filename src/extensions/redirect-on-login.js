module.exports = {
    type: 'onPreResponse',
    method: (request, reply) => {

        const { isAuthenticated, mode } = request.auth;
        const { headers } = request.response;

        // If the user got booted to /login on an auth'd endpoint,
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
