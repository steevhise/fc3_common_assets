
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
            payload: Joi.object({
                emails: Joi.array().items(Joi.string().email()).single(),
                ids: Joi.array().items(Joi.number()).single()
            }).or('emails', 'ids') // TODO Adjust error response?
        }
    },
    handler(request, reply) {

        const { userService } = request.server;
        const { emails, ids } = request.payload;
        const { id: friender } = request.auth.credentials;

        const friendees = [].concat(emails || [])
            .concat(ids || []);

        console.log(emails, ids, friendees);
        //process.exit(0);

        return userService.batchFriend({ friender, friendees })
        .then(() => reply('Friend requests sent!'));
    }
};
