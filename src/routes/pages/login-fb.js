const Hoek = require('hoek');
const WGQL = require('@freecycle/common-hapi-plugins/modules/graphql-wrapper');

module.exports = {
    method: '*', // Must handle both GET and POST
    path: '/fb_login',          // The callback endpoint registered with the provider
    config: {
        id: 'pages_fblogin',
        description: 'go here to log in via FB',
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
            // return reply.redirect('/desktop-dash');

            const query = '{ user_static (where: {facebook_id: ' + fbId + '}) {   facebook_id user_id} } ';
            WGQL.GraphQLWrapper(request.server, query, 'user_static.user_id', (err, result) => {

                Hoek.assert(!err, err);
                const userId = result.user_static.user_id;
                console.log('userId ', userId);

                reply.setCookie(Number(userId), (err, cookieContent) => {

                    Hoek.assert(!err, 'Error: ' + err);

                    // or success
                    reply.state('MyFreecycle', cookieContent);
                    console.log('ok we gave out the cookie after Facebook login', cookieContent);
                    return reply.redirect('/desktop-dash');
                });
            });
        }
    }
};
