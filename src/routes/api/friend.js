
const Hoek = require('hoek');
const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/api/friend',
    config: {
        description: 'Friend one or more users',
        tags: ['api'],
        auth: {
            mode: 'required'
        },
        validate: {
            payload: (value, options, next) => {

                const processed = Hoek.shallow(value);
                if (processed.emails) {
                    // multiple emails input sends comma-separated list as a string :(
                    processed.emails = value.emails.split(',').map((email) => email.trim());
                }

                const validation = Joi.object({
                    emails: Joi.array().items(Joi.string().email()).single(),
                    ids: Joi.array().items(Joi.number()).single()
                }).or('emails', 'ids').validate(processed);

                if (validation.error) {
                    return next(validation.error);
                }

                return next(null, validation.value);
            },
            failAction: (_, reply) => reply('We were unable to send your friend requests due to momentary technical difficulties. Sorry!').code(503)
        }
    },
    handler(request, reply) {

        const { userService } = request.server;
        const { emails, ids } = request.payload;
        const { id: friender } = request.auth.credentials;

        const friendees = [].concat(emails || [])
            .concat(ids || []);

        return userService.batchFriend({ friender, friendees })
        .then(() => reply(`Friend request${ friendees.length > 1 ? 's' : ''} sent!`));
    }
};
