const Boom = require('boom');
const { PRIV_ADMIN_CONTROL_CENTER } = require('../routes/scopes');

module.exports = {
    type: 'onPostAuth',
    method: (request, reply) => {

        const { pluginOptions: options } = reply.realm;
        const tags = [].concat(request.route.settings.tags || []);
        const id = request.route.settings.id;

        if (!options.maintenanceMode || tags.includes('asset') || id === 'pages_login' || id === 'pages_logout') {
            return reply.continue();
        }

        const { isAuthenticated, credentials } = request.auth;

        if (isAuthenticated && credentials.scope.includes(PRIV_ADMIN_CONTROL_CENTER)) {
            return reply.continue();
        }

        return reply(Boom.serverUnavailable('Freecycle is down for maintenance', { maintenanceMode: true }));
    },
    options: {
        sandbox: 'plugin'
    }
};
