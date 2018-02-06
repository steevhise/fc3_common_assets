const Util = require('util');
const FCPost = require('@freecycle/common-hapi-plugins/modules/freecycle-post');
const FCUser = require( '@freecycle/common-hapi-plugins/modules/freecycle-user');

exports.register = Util.callbackify((server, options) => {

    server.decorate('server', 'Post', FCPost.postClassFunc(server));
    server.decorate('server', 'User', FCUser.userClassFunc(server));

    const combine = (...arrays) => [].concat(...arrays);

    return server.register(combine(
        require('./plugins/frontend'),
        require('./plugins/auth')
    ))
    .then(() => {

        // declare some server extensions
        server.ext(combine(
            require('./extensions/preauth.js'),
            require('./extensions/errors.js')
        ));

        // store user info that we can get to from anywhere.
        server.app.cache = server.cache({
            cache: 'freecycleMain',
            segment: 'sessions',
            shared: true,
            expiresIn: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        // TODO pull auth-cookie-freecycle strategy config up into fc3_main
        server.auth.strategy('session', 'cookie', 'try', Object.assign({}, server.plugins['auth-cookie-freecycle'].strategy, {
            redirectOnTry: false
        }));

        // Declare an authentication strategy using the bell scheme for Facebook login
        // with the name of the provider, cookie encryption password,
        // and the OAuth client credentials.
        server.auth.strategy('facebook', 'bell', false, {
            provider: 'facebook',
            password: options.cookiePassword,
            clientId: options.facebook.clientId,
            clientSecret: options.facebook.clientSecret,
            isSecure: !options.dev,     // Terrible idea to be false but required if not using HTTPS especially if developing locally
            providerParams: { display: 'popup' }
        });

        server.views(require('./view-manager')(server, options));

        server.route(require('./routes'));
    });
});

exports.register.attributes = {
    pkg: require('../package.json'),
    dependencies: [
        '@freecycle/freecycle_graphql_schema'
    ]
};
