const Joi = require('joi');
const RouteHelpers = require('../helpers');

module.exports = {
    method: 'GET',
    path: '/town/{uniqueName}/info',
    config: {
        id: 'groups_info',
        description: 'The named town\'s information.',
        validate: {
            params: {
                // NOTE Joi.number needs to be the first alternative tried, so we cast any numeric ids (i.e. group_id), which come in as strings, to numbers
                // Otherwise, a string representation of a number would hit our fetchByIdentifier call, which would interpret the string as the yahoo_group_name
                uniqueName: Joi.alternatives([Joi.number().integer(), Joi.string()])
            },
            failAction: (request, reply, source, error) => {

                if (!request.params.uniqueName) {
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

        const { siteService } = request.server;
        const { group, membershipChecks } = request.pre.groupDetail;

        return siteService.fetchStatistics()
        .then(({ userCount, townCount }) => {

            const descriptionTokens = {
                '%%copyright': 'The official TFN copyright notice.', // TODO Where do I get this?
                '%%disclaimer': 'The official TFN disclaimer.', // TODO Where do I get this?
                '%%freecycle_logo': '<img src="/images/logo.png" />', // TODO Need to set a width and height here?
                '%%group_name': group.group_name,
                '%%num_groups': townCount,
                '%%num_members': group.num_members,
                '%%total_num_members': userCount,
                '%%yahoogroup_link': `<a href="/town/${group.yahoo_group_name}">${group.yahoo_group_name}</a>"`
            };

            group.description = group.description.replace(/%%\w+/g, (match) => {

                return descriptionTokens[match] || match;
            });

            reply.view('groups/group', {
                data: {
                    group,
                    ...membershipChecks
                },
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
