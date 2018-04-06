const Hoek = require('hoek');
const Joi = require('joi');

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

        const { groupService, postService, userService, siteService } = request.server;
        const { uniqueName } = request.params;
        const { isAuthenticated, credentials } = request.auth;

        request.log('debug', 'about to look up group ' + uniqueName);

        return groupService.fetchByIdentifier(uniqueName).then((group) => {

            if (!group) {
                reply.state('redirectedError', {
                    message: 'Sorry, we couldn\'t find that group. Try searching!',
                    path: request.route.path.replace('{uniqueName?}', uniqueName),
                    type: 'groupNotFound'
                });
                return reply.redirect('/find-towns').temporary();
            }

            const { latitude, longitude, group_id: groupId } = group;

            return Promise.all([
                groupService.fetchNearest({ latitude, longitude }),
                postService.forGroup(group.group_id),
                isAuthenticated ? userService.fetchTownMemberships(credentials.id, true) : Promise.resolve([]),
                siteService.fetchMembershipStatistics(groupId)
            ])
                .then(([groups, posts, memberships, membersCount]) => {

                    const tags = Hoek.unique(Hoek.flatten(posts.map(({ tags }) => tags)), 'id');
                    const isMember = Hoek.contain(memberships, [{ id: groupId, isPending: 0 }], { deep: true });
                    const isPending = Hoek.contain(memberships, [{ id: groupId, isPending: 1 }], { deep: true });

                    reply.view('groups/group', {
                        data: {
                            group,
                            posts,
                            groups,
                            tags,
                            membersCount
                        },
                        isAuthenticated,
                        isMember,
                        isPending,
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
