
const Joi = require('joi');
const Wreck = require('wreck');

module.exports = {
    method: 'GET',
    path: '/fb-disconnect',
    config: {
        id: 'pages_fbdisconnect',
        description: 'Disconnect your Freecycle account from a connected Facebook account',
        tags: ['login', 'exclude'],
        auth: { mode: 'required' },
        validate: {
            query: {
                facebookId: Joi.number().required() // facebook id number exceeds allowable size of Joi integer definition
            }
        }
    },
    handler: function (request, reply) {

        const { authService } = request.server;
        const { facebookId } = request.query; // Passed in query string on settings page
        const { clientId, clientSecret } = request.server.registrations.fc3_main.options.facebook;

        return Promise.resolve()
        .then(() => {

            // https://developers.facebook.com/docs/facebook-login/permissions/requesting-and-revoking#revoking
            // see Generating Access Tokens https://developers.facebook.com/docs/facebook-login/access-tokens/
            return Wreck.delete(`https://graph.facebook.com/${facebookId}/permissions?access_token=${clientId}|${clientSecret}`);
        })
        .then(({ res, payload }) => {

            const { success } = JSON.parse(payload.toString());

            // API still returns true if no perms to delete , so this case
            // would mean issue connecting w/ FB, perms issue, etc. Something's really screwed
            if (!success) {
                throw new Error('Facebook disconnection failed');
            }

            return authService.facebookDisconnect(facebookId);
        })
        .then(() => reply.redirect('/home/settings').temporary())
        .catch((err) => {

            if (err instanceof authService.UserDoesNotExistError) {
                reply.state('redirectedError', {
                    type: 'data',
                    message: 'Sorry, looks like that account has already been disconected from Facebook'
                });
                return reply.redirect('/home/settings').temporary();
            }

            throw err;
        });
    }
};
