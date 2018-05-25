const Joi = require('joi');
const Mocks = require('./helpers/mocks');
const RouteHelpers = require('../helpers');

module.exports = {
    method: '*',
    path: '/town/{uniqueName}/contact',
    config: {
        id: 'groups_contact',
        description: 'Contact the named town\'s moderators',
        validate: {
            params: {
                // NOTE Joi.number needs to be the first alternative tried, so we cast any numeric ids (i.e. group_id), which come in as strings, to numbers
                // Otherwise, a string representation of a number would hit our fetchByIdentifier call, which would interpret the string as the yahoo_group_name
                uniqueName: Joi.alternatives([Joi.number().integer(), Joi.string()])
            },
            payload: {
                from: Joi.string().email().required(),
                subject: Joi.string().max(78).required(), // max 78 from here: https://tools.ietf.org/html/rfc2822#section-2.1.1
                message: Joi.string().required() // TODO Any limit here?
            },
            failAction: (request, reply, source, error) => {

                if (source === 'params' && !request.params.uniqueName) {
                    // takeover is necessary due to reply interface working inconsistently in pre's vs. elsewhere
                    return reply.redirect('/find-towns').temporary().takeover();
                }

                if (source === 'payload') {
                    return RouteHelpers.formFailAction(request, reply, source, error);
                }

                throw error;
            }
        },
        pre: [
            RouteHelpers.groupDetailPre,
            (request, reply) => {

                if (request.method === 'get') {
                    return reply.continue();
                }

                const { groupService } = request.server;
                const { group: { group_id: groupId } } = request.pre.groupDetail;

                // Handle POST (interfaces with Vue Form component)
                if (request.app.formValidation) {
                    return reply('We were unable to send your message due to invalid data. Sorry! Doublecheck the data you entered and try again').code(400).takeover();
                }

                return groupService.fetchModerators(groupId)
                .then((moderators) => {

                    // TODO Email all moderators for the group

                    // Vue form (in fc3_common_assets) expects response to have message property
                    return reply({ message: 'Thanks for contact the group moderators! Someone will be in touch shortly' }).takeover();
                })
                .catch((err) => {

                    // .code(500) is necessary for communicating a JSON response to the AJAX request from the Vue form
                    // This sends a message that's interpreted by that handler as an error, but, b/c it's not a Boom, isn't snagged by our error extension
                    return reply('We\'re experiencing technical difficulties at this time and were unable to send your message. Sorry for the inconvenience!').code(500).takeover()
                });
            }
        ]
    },
    handler: function (request, reply) {

        const { groupService } = request.server;
        const { group, membershipChecks } = request.pre.groupDetail;
        const { isAuthenticated } = request.auth;
        const userEmail = isAuthenticated ? request.auth.credentials.email : null;

        reply.view('groups/group', {
            data: {
                group,
                userEmail,
                ...membershipChecks
            },
            inBodyAds: [
                'one',
                'two'
            ]
        });
    }
};
