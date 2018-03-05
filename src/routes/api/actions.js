const Hoek = require('hoek');
const Boom = require('boom');
const ActionModels = require('../../models');

// route definitions
module.exports = [
    {
        method: '*',
        path: '/actions',
        config: {
            id: 'actions',
            description: 'the actions route',
            auth: { mode: 'required' },

            // auth seems to work now and doesn't screw up data saving in handler.
            plugins: {
                'hapiAuthorization': { aclQuery: (id, request, cb) => {

                    const userId = request.auth.credentials.id;
                    const postId = Number(request.payload.post_id);

                    new request.server.Post(postId, (err, post) => {

                        if (err) {
                            return cb(err);
                        }

                        if (post.user_id !== userId) {
                            request.log('authorization', `post author id is ${post.user_id} but current user is ${userId}`);
                            return cb(Boom.forbidden());
                        }

                        // allowed
                        return cb(null, true);
                    });
                } }
            }
        },
        handler: function (request, reply) {

            // determine the command, nullify if the command is undefined
            // NOTE: See the models directory.
            const command = request.payload.command || null;

            if (request.payload.command === null) {
                // this should never hit because we are handling the command properly,
                // however this is left in place as a catch all if all else fails.
                return reply({
                    message: 'Error please provide a valid command.'
                });
            }

            return ActionModels[command](request, reply);
        }
    }
];
