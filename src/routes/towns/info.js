const Joi = require('joi');
const RouteHelpers = require('../helpers');

const internals = {};

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
                '%%copyright': internals.copyright(),
                '%%disclaimer': internals.standardDisclaimer(),
                '%%freecycle_logo': '<fc-icon name="logo"></fc-icon>',
                '%%group_name': group.group_name,
                '%%num_groups': Number(townCount).toLocaleString(), // Formats numbers with commas
                '%%num_members': Number(group.num_members).toLocaleString(),
                '%%total_num_members': Number(userCount).toLocaleString(),
                '%%yahoogroup_link': `<a href="/town/${group.yahoo_group_name}">${group.yahoo_group_name}</a>"`
            };

            let subbedDescription = group.description.replace(/%%\w+/g, (match) => {

                return descriptionTokens[match] || match;
            });

            reply.view('groups/group', {
                data: {
                    group,
                    subbedDescription,
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


internals.standardDisclaimer = () => `
    <p>
        DISCLAIMER: FREECYCLE NETWORK MEMBERS USE THE LIST AT THEIR OWN RISK. Please
        take reasonable measures to protect your safety and privacy when posting to
        the list or participating in an exchange. By joining the list, you agree to hold
        neither the list owners and moderators nor anyone affiliated with Freecycle.org
        responsible or liable for any circumstance resulting from a Freecycle-related
        exchange or communication.
    </p>
`;


internals.copyright = () => `
    <p>
        Copyright &copy; ${new Date().getFullYear()} The Freecycle Network (<a href="http://www.freecycle.org">http://www.freecycle.org</a>).
        All rights reserved. Freecycle and the Freecycle logo are trademarks of The Freecycle Network in various countries.
    </p>
`;
