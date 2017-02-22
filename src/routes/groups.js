
// route definitions
module.exports = [
    {
        method: 'GET',
        path: '/group/{unique_group_name}',
        config: {
            id: 'group',
            description: 'a group page, for example try /group/freecycle'
            /*plugins: { 'auth-cookie-freecycle': {
             redirectTo: false,
             redirectOnTry: false
             }}*/
        },
        handler: function (request, reply) {

            const inBodyAds = [
                'one',
                'two'
            ];

            const unique_name = request.params.unique_group_name;
            request.log('debug', 'about to look up group ' + unique_name);

           /* new request.server.Group(unique_name, function(err, group) {
                console.log('returned from  constructor:');
                console.log(group);*/

           // fake data for now
            const group = { group_name: 'Tucson',
                unique_group_name: 'freecycle',
                num_members: 6900,
                group_id: 1014,
                posts: [{ post_id: 100 }, { post_id:101 }, { post_id:103 }, { post_id:105 }]
            };

            reply.view('groups/group.html', {
                showFilterSelectors: true,
                inBodyAds,
                    // title: "Post #" + post_id,
                    // footerMenuItems: footerMenuItems,
                group
            });

            // });
        }
    }
];
