const Hoek = require('hoek');
const Joi = require('joi');
const Constants = require('@freecycle/common-hapi-plugins/constants');
const RouteHelpers = require('../helpers');

const internals = {};

module.exports = {
    method: 'GET',
    // id may be either a Group's group_id or yahoo_group_name (see checks in Group service, fetchByIdentifier)
    path: '/town/{uniqueName?}',
    config: {
        id: 'groups_main',
        description: 'A town page, for example try /town/freecycle',
        validate: {
            params: {
                // NOTE Joi.number needs to be the first alternative tried, so we cast any numeric ids (i.e. group_id), which come in as strings, to numbers
                // Otherwise, a string representation of a number would hit our fetchByIdentifier call, which would interpret the string as the yahoo_group_name
                uniqueName: Joi.alternatives([Joi.number().integer(), Joi.string()])
            }
        },
        pre: [
            (request, reply) => {

                if (!request.params.uniqueName) {
                    // takeover is necessary due to reply interface working inconsistently in pre's vs. elsewhere
                    return reply.redirect('/find-towns').temporary().takeover();
                }

                return reply.continue();
            }
        ]
    },
    handler: function (request, reply) {

        const { groupService, postService } = request.server;
        const { uniqueName } = request.params;

        return groupService.fetchByIdentifier(uniqueName).then((group) => {

            if (!group) {
                return RouteHelpers.groupNotFound(request, reply);
            }

            const { latitude, longitude, group_id: groupId } = group;

            return Promise.all([
                group,
                groupService.fetchNearest({ latitude, longitude }, groupId),
                postService.forGroup(groupId),
                RouteHelpers.groupMembershipStatus(request, groupId)
            ]);
        })
        .then(([group, groups, posts, membershipChecks]) => {

            const tags = Hoek.unique(Hoek.flatten(posts.map(({ tags }) => tags)), 'id');

            // Handles a predictable membership action error
            const errors = [];
            if (request.state.redirectedError) {
                const { redirectedError } = request.state;
                if (redirectedError.type === 'membershipActionFailed') {
                    errors.push({
                        message: redirectedError.message
                    });
                }
                // Clean up the error cookie to ensure no fraudulent errors on subsequent visits in the session
                reply.unstate('redirectedError');
            }

            reply.view('groups/group', {
                data: {
                    group,
                    // TODO Incorporate work from Bug199 (user post read permissions) into the posts passed here
                    posts,
                    groups,
                    tags,
                    ...membershipChecks
                },
                showFilterSelectors: true,
                isGroup: true,
                inBodyAds: [
                    'one',
                    'two'
                ],
                errors
            });
        });
    }
};
