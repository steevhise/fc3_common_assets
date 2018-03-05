const Mocks = require('./helpers/mocks');

module.exports = {
    method: 'GET',
    path: '/town/info/{uniqueName}',
    config: {
        id: 'group_info',
        description: 'The named town\'s information.'
    },
    handler: function (request, reply) {

        const freecycle = {
            copyright:    'The official TFN copyright notice.',
            disclaimer:   'The official TFN disclaimer.',
            logo:         'The official TFN logo  (bare <img> tag with width and height attributes)',
            num_groups:   'The number of official freecycle towns.',
            num_members:  'The total number of members in all towns.'
        };

        const descriptionTokens = {
            '%%copyright': freecycle.copyright,
            '%%custom_logo': Mocks.group.logo,
            '%%disclaimer': freecycle.disclaimer,
            '%%freecycle_logo': freecycle.logo,
            '%%group_name': Mocks.group.group_name,
            '%%num_groups': freecycle.num_groups,
            '%%num_members': Mocks.group.num_members,
            '%%total_num_members': freecycle.num_members,
            '%%yahoogroup_link': '<a href="' + Mocks.group.yahoo_group_name + '">' + Mocks.group.yahoo_group_name + '</a>"'
        };

        const group = Object.assign({}, Mocks.group);

        group.description = group.description.replace(/%%\w+/g, (all) => {

            return descriptionTokens[all] || all;
        });

        reply.view('groups/info', {
            group,
            freecycle,
            inBodyAds: [
                'one',
                'two'
            ]
        });
    }
};
