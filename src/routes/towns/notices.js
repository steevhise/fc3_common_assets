const Hoek = require('hoek');
const Joi = require('joi');
const RouteHelpers = require('../helpers');

module.exports = {
    method: 'GET',
    path: '/town/{uniqueName}/notices',
    config: {
        id: 'groups_notices',
        description: 'The named town\'s notices.',
        validate: {
            params: {
                // NOTE Joi.number needs to be the first alternative tried, so we cast any numeric ids (i.e. group_id), which come in as strings, to numbers
                // Otherwise, a string representation of a number would hit our fetchByIdentifier call, which would interpret the string as the yahoo_group_name
                uniqueName: Joi.alternatives([Joi.number().integer(), Joi.string()])
            },
            failAction: (request, reply, source, error) => {

                if (!request.params.uniqueName) {
                    // takeover is necessary due to reply interface working inconsistently in pre's vs. elsewhere
                    return reply.redirect('/find-towns').temporary().takeover();
                }

                throw error;
            }
        },
        pre: [
            RouteHelpers.groupDetailPre
        ]
    },
    handler: function (request, reply) {

        const { groupService } = request.server;
        const { uniqueName } = request.params;
        const { isAuthenticated } = request.auth;
        const userId = isAuthenticated ? request.auth.credentials.id : null;
        const { group, membershipChecks } = request.pre.groupDetail;

        if (!group) {
            return RouteHelpers.groupNotFound(request, reply);
        }

        const errors = [];
        if (request.state.redirectedError) {
            const { redirectedError } = request.state;
            if (redirectedError.type === 'noticeNotFound') {
                errors.push({
                    message: redirectedError.message
                });
            }
            reply.unstate('redirectedError');
        }

        return groupService.fetchNotices(group.group_id, userId, membershipChecks.isMember)
        .then(({ notices }) => {

            reply.view('groups/group', {
                data: {
                    group,
                    notices,
                    ...membershipChecks
                },
                errors,
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
