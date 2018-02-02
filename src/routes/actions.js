const Hoek = require('hoek');
const Boom = require('boom');
const ActionModels = require('../models');

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
                    console.log('auth routine found postId: ' + postId);
                    new request.server.Post(postId, (err, post) => {

                        Hoek.assert(!err, 'Problem getting post!');
                        if (post.user_id === userId) {
                            // allowed
                            cb(null, true);
                        }
                        else {
                            request.log('authorization', `post author id is ${post.user_id} but current user is ${userId}`);
                            cb(Boom.forbidden(), true);
                        }
                    });
                } }
            }
        },
        handler: function (request, reply) {
            // determine the command, nullify if the command is undefined
            // NOTE: See the models directory.
            const command = request.payload.command || null;

            if (request.payload.command !== null) {
                // wrap processing of command in a try catch so that we can handle the exception if there is one
                // and gracefully do something with the users' request.
                try {
                    ActionModels[command](request, reply);
                }
                catch (error) {
                    Hoek.assert(!error, 'Problem with command!');
                }
            }
            else {
                // this should never hit because we are handling the command properly,
                // however this is left in place as a catch all if all else fails.
                reply.response({
                    message: 'Error please provide a valid command.'
                });
            }
        }
    }
];
