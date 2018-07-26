const Util = require('util');
const FCPost = require('@freecycle/common-hapi-plugins/modules/freecycle-post');
const FCUser = require( '@freecycle/common-hapi-plugins/modules/freecycle-user');
const FCGroup = require( '@freecycle/common-hapi-plugins/modules/freecycle-group');
const PostService = require('@freecycle/common-hapi-plugins/services/post');
const UserService = require('@freecycle/common-hapi-plugins/services/user');
const GroupService = require('@freecycle/common-hapi-plugins/services/group');
const AuthService = require('@freecycle/common-hapi-plugins/services/auth');
const SearchService = require('@freecycle/common-hapi-plugins/services/search');
const SiteService = require('@freecycle/common-hapi-plugins/services/site');
const AlertService = require('@freecycle/common-hapi-plugins/services/alert');
const PageService = require('@freecycle/common-hapi-plugins/services/page');
const TagService = require('@freecycle/common-hapi-plugins/services/tag');
const MessagingService = require('@freecycle/common-hapi-plugins/services/messaging');
const { loadGearmanConfig } = require('@freecycle/common-hapi-plugins/modules/helpers');
const EmailService = require( '@freecycle/common-hapi-plugins/services/email');

exports.register = Util.callbackify((server, options) => {

    server.decorate('server', 'Post', FCPost.postClassFunc(server));
    server.decorate('server', 'User', FCUser.userClassFunc(server));
    server.decorate('server', 'Group', FCGroup.groupClassFunc(server));
    server.decorate('server', 'postService', new PostService(server, { PostEntity: server.Post, UserEntity: server.User, imagesURL: options.imagesURL }));
    server.decorate('server', 'userService', new UserService(server, { UserEntity: server.User, imagesURL: options.imagesURL }));
    server.decorate('server', 'groupService', new GroupService(server, { GroupEntity: server.Group }));
    server.decorate('server', 'authService', new AuthService(server, { UserEntity: server.User }));
    server.decorate('server', 'searchService', new SearchService(server));
    server.decorate('server', 'siteService', new SiteService(server));
    server.decorate('server', 'alertService', new AlertService(server));
    server.decorate('server', 'pageService', new PageService(server));
    server.decorate('server', 'tagService', new TagService(server));
    server.decorate('server', 'messagingService', new MessagingService(server, { imagesURL: options.imagesURL }));
    server.decorate('server', 'emailService', new EmailService(server, loadGearmanConfig(options.legacyConfigPath), options.dev));

    const combine = (...arrays) => [].concat(...arrays);

    return server.register(combine(
        require('./plugins/frontend')(server, options),
        require('./plugins/auth')(server, options)
    ))
    .then(() => {

        // declare some server extensions
        server.ext(combine(
            require('./extensions/guarantee-user-info'),
            require('./extensions/errors'),
            require('./extensions/alert-count'), // Order matters here; alert-count is expected to run after the errors check
            require('./extensions/unread-replies'),
            require('./extensions/maintenance')
        ));

        server.state(...require('./cookies/location')(server, options));
        server.state(...require('./cookies/redirected-error')(server, options));
        server.state(...require('./cookies/start-a-town')(server, options));

        // store user info that we can get to from anywhere.
        server.app.cache = server.cache({
            cache: 'freecycleMain',
            segment: 'sessions',
            shared: true,
            expiresIn: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        // TODO pull auth-cookie-freecycle strategy config up into fc3_main
        server.auth.strategy('session', 'cookie-freecycle', 'try', {
            isSecure: !options.dev,
            redirectTo: '/login',
            redirectOnTry: false,    // if mode is 'try' on a public page, don't redirect them if they're not logged in
            domain: '.freecycle.org'
        });

        // Declare an authentication strategy using the bell scheme for Facebook login
        // with the name of the provider, cookie encryption password,
        // and the OAuth client credentials.
        server.auth.strategy('facebook', 'bell', false, {
            provider: 'facebook',
            password: options.cookiePassword,
            clientId: options.facebook.clientId,
            clientSecret: options.facebook.clientSecret,
            isSecure: !options.dev,
            scope: ['email', 'user_friends']
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
