const Joi = require('joi');
const RouteHelpers = require('../helpers');

module.exports = {
    method: 'GET',
    path: '/town/{uniqueName}/notices/{noticeId}',
    config: {
        id: 'groups_notices_detail',
        description: 'The named town\'s notices.',
        validate: {
            params: {
                // NOTE Joi.number needs to be the first alternative tried, so we cast any numeric ids (i.e. group_id), which come in as strings, to numbers
                // Otherwise, a string representation of a number would hit our fetchByIdentifier call, which would interpret the string as the yahoo_group_name
                uniqueName: Joi.alternatives([Joi.number().integer(), Joi.string()]),
                noticeId: Joi.number().integer().min(1)
            },
            failAction: (request, reply, source, error) => {

                if (!request.params.uniqueName) {
                    return reply.redirect('/find-towns');
                }

                return reply.redirect(`/town/${request.params.uniqueName}/notices`);
            }
        },
        pre: [
            RouteHelpers.groupDetailPre
        ]
    },
    handler: (request, reply) => {

        const { groupService } = request.server;
        const { uniqueName, noticeId } = request.params;
        const { isAuthenticated } = request.auth;
        const userId = isAuthenticated ? request.auth.credentials.id : null;
        const { group, membershipChecks } = request.pre.groupDetail;

        if (!group) {
            return RouteHelpers.groupNotFound(request, reply);
        }

        return groupService.fetchNotice(group.group_id, noticeId, userId, membershipChecks.isMember)
        .then((notice) => {

            // reply with file as attachment if not html or plaintext
            if (!(/text\/(plain|html)$/.test(notice.mimetype))) {
                return reply(notice.buffer)
                    .type(notice.mimetype)
                    .header('Content-Disposition', 'attachment');
            }

            reply.view('groups/group', {
                data: {
                    group,
                    notice: {
                        ...notice,
                        content: notice.buffer.toString()
                    },
                    ...membershipChecks
                },
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        })
        .catch((err) => {

            if (err instanceof groupService.NoticeNotFound) {
                reply.state('redirectedError', {
                    message: err.message,
                    path: request.route.path.replace('{uniqueName}', uniqueName).replace('{noticeId}', noticeId),
                    type: 'noticeNotFound'
                });

                return reply.redirect(`/town/${uniqueName}/notices`).temporary();
            }
        });
    }
};
