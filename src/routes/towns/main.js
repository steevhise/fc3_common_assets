const Hoek = require('hoek');
const Joi = require('joi');
const Constants = require('@freecycle/common-hapi-plugins/constants');

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

        const { groupService, postService, userService } = request.server;
        const { uniqueName } = request.params;
        const { isAuthenticated, credentials } = request.auth;

        request.log('debug', 'about to look up group ' + uniqueName);

        return groupService.fetchByIdentifier(uniqueName).then((group) => {

            if (!group) {
                return internals.groupNotFound(request, reply);
            }

            const { latitude, longitude, group_id: groupId } = group;
            const isInviteOnly = group.invitation_only === 1;

            return Promise.all([
                groupService.fetchNearest({ latitude, longitude }, groupId),
                isInviteOnly ? groupService.fetchInvitation(credentials.id, groupId) : Promise.resolve(null),
                postService.forGroup(group.group_id),
                isAuthenticated ? userService.fetchTownMemberships(credentials.id, true) : Promise.resolve([])
            ])
                .then(([groups, invitation, posts, memberships]) => {

                    const isMember = Hoek.contain(memberships, [{ id: groupId, isPending: 0 }], { deep: true });
                    const isPending = Hoek.contain(memberships, [{ id: groupId, isPending: 1 }], { deep: true });
                    // Will be false when: a.) non-invite_only group b.) invite_only group that user isn't invited to
                    const isInvited = Boolean(invitation);

                    // User shouldn't be able to view a group if it's invite_only and their neither a member nor invited
                    if (isInviteOnly) {
                        // for an invite_only group we want to say not found only if no invitation AND user's not a member
                        // NOTE There are no pending memberships for invitation_only groups; an invitation is that group's equivalent to a pending membership
                        // A membership for an invite_only is created ONLY when a user accepts the invite
                        // TODO None of the above logic is built in fc3, just how things work in legacy (core_modules)
                        if (!isMember && !isInvited) {
                            return internals.groupNotFound(request, reply);
                        }
                    }

                    // We count only approved memberships toward the limit.
                    // TODO Make sure to prevent multiple pending memberships from exceeding this limit on the moderation side
                    const membershipLimitReached = memberships.filter((memb) => memb.isPending === 0).length === Constants.MAX_GROUPS;
                    const noCoordinates = (latitude === 0 && longitude === 0) ? true : false;
                    const requiresApproval = group.members_require_approval || false;
                    const tags = Hoek.unique(Hoek.flatten(posts.map(({ tags }) => tags)), 'id');

                    reply.view('groups/group', {
                        data: {
                            group,
                            // TODO Incorporate work from Bug199 (user post read permissions) into the posts passed here
                            posts,
                            groups,
                            tags
                        },
                        isAuthenticated,
                        isMember,
                        isPending,
                        isInvited,
                        noCoordinates,
                        requiresApproval,
                        membershipLimitReached,
                        showFilterSelectors: true,
                        isGroup: true,
                        inBodyAds: [
                            'one',
                            'two'
                        ]
                    });
                });
        });
    }
};

// TODO If deemed more generally helpful, move into routes/helpers and generalize
internals.groupNotFound = (request, reply) => {

    reply.state('redirectedError', {
        message: 'Sorry, we couldn\'t find that group. Try searching!',
        path: request.route.path.replace('{uniqueName?}', request.params.uniqueName),
        type: 'groupNotFound'
    });

    return reply.redirect('/find-towns').temporary();
};
