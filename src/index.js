'use strict';

const Util = require('util');
const Graphql = require('graphql');
const { default: Schema } = require('@freecycle/freecycle_graphql_schema');
const { Context } = require('@freecycle/freecycle_node_dal');
const FCPost = require('@freecycle/common-hapi-plugins/lib/freecycle-post');
const FCUser = require( '@freecycle/common-hapi-plugins/lib/freecycle-user');

exports.register = Util.callbackify((server, options) => {

    server.decorate('server', 'Post', FCPost.postClassFunc(server));
    server.decorate('server', 'User', FCUser.userClassFunc(server));
    server.decorate('server', 'context', Context);
    server.decorate('server', 'graphql', Graphql.graphql);
    server.decorate('server', 'schema', Schema);

    const combine = (...arrays) => [].concat(...arrays);

    return server.register(combine(
        require('./plugins/frontend'),
        require('./plugins/auth')
    ))
    .then(() => {

        // store user info that we can get to from anywhere.
        server.app.cache = server.cache({
            cache: 'freecycleMain',
            segment: 'sessions',
            shared: true,
            expiresIn: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        // TODO pull auth-cookie-freecycle strategy config up into fc3_main
        server.auth.strategy('session', 'cookie', 'try', server.plugins['auth-cookie-freecycle'].strategy);

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

        // TODO only has to be called on root to work with hapi-error
        server.root.views(require('./view-manager')(server, options));

        server.route(combine(
            require('./routes/actions'),
            require('./routes/admin'),
            require('./routes/groups'),
            require('./routes/home'),
            require('./routes/pages'),
            require('./routes/posts'),
            require('./routes/static')
        ));
    });
});

exports.register.attributes = {
    pkg: require('../package.json')
};
