const Hoek = require('hoek');
const WGQL = require('@freecycle/common-hapi-plugins/modules/graphql-wrapper');

module.exports = {
    method: '*', // Must handle both GET and POST
    path: '/fb_login',          // The callback endpoint registered with the provider
    config: {
        id: 'pages_fblogin',
        description: 'Log in via FB',
        tags: ['login', 'exclude'],
        auth: 'facebook',
        handler: function (request, reply) {

            if (!request.auth.isAuthenticated) {
                return reply('Authentication failed due to: ' + request.auth.error.message);
            }

            // Perform any account lookup or registration, setup local session,
            // and redirect to the application. The third-party credentials are
            // stored in request.auth.credentials. Any query parameters from
            // the initial request are passed back via request.auth.credentials.query.
            // I assume we get facebook id from credentials and then look up the FC user id.

            const fbId = request.auth.credentials.profile.id;

            request.log('debug', fbId);

            const query = '{ user_static (where: {facebook_id: ' + fbId + '}) {   facebook_id user_id} } ';
            WGQL.GraphQLWrapper(request.server, query, 'user_static.user_id', (err, result) => {

                if (err) {
                    return reply(err);
                }

                const userId = result.user_static.user_id;

                reply.setCookie(Number(userId), (err, cookieContent) => {

                    Hoek.assert(!err, 'Error: ' + err);

                    // or success
                    reply.state('MyFreecycle', cookieContent);

                    return reply.redirect('/home/dashboard');
                });
            });
        }
    }
};
