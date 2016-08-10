'use strict';

/*
This is for restricted sections of the site that control and administrate the site, functions sepratate from Mod Tools and Group Admin.

 */

// route definitions
module.exports = [
    {
        method: 'GET',
        path: '/admin/pages',
        handler: function (request, reply) {
            console.log('hi admin/pages');
            reply.view('admin/pages', {
                title: "Administrate Pages",
                // footerMenuItems: footerMenuItems,

            });
        }
    }
];
