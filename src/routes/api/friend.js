
const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/api/friend',
    config: {
        description: 'Friend one or more users',
        tags: ['api']
        /*validate: {
            payload: Joi.object({
                emails: Joi.array().items(Joi.string().email()).single(),
                ids: Joi.array().items(Joi.number()).single()
            }).xor('emails', 'ids') // TODO Adjust error response
        }*/
    },
    handler(request, reply) {

        //const { emails, ids } = request.payload;

        // If ids, just friend
        // If emails, lookup, then more complicated bolognese

        return reply('Friend requests sent!');

        // friend({ friender, friendee })  expects 2 user ids
        // Given emails, need to look up email, get user id
    }
};
