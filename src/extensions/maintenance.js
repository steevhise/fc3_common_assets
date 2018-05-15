const Boom = require('boom');

const ACCESS_TO_CTL_CENTER = 1; // A privilege_type_id

module.exports = {
    type: 'onPostAuth',
    method: (request, reply) => {

        const { pluginOptions: options } = reply.realm;
        const tags = [].concat(request.route.settings.tags || []);

        if (!options.maintenanceMode || tags.includes('asset')) {
            return reply.continue();
        }

        const { isAuthenticated, credentials } = request.auth;

        if (isAuthenticated && !credentials.role.includes(ACCESS_TO_CTL_CENTER)) {
            return reply.continue();
        }

        return reply(Boom.serverUnavailable('Freecycle is down for maintenance', { maintenanceMode: true }));
    },
    options: {
        sandbox: 'plugin'
    }
};
