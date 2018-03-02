module.exports = {
    method: 'GET',
    path: '/home/settings',
    config: {
        id: 'home_settings',
        description: 'Edit user profile.',
        auth:  { mode: 'required' }
    },
    handler: function (request, reply) {

        const languageOptions = ['English', 'Spanish', 'French', 'German', 'Esperanto'];

        const notificationOptions = [
            {
                type: 'Email Digest',
                description: 'Receive a summary of all new posts'
            },
            {
                type: 'Per Post',
                description: 'Receive an email for every new post'
            },
            {
                type: 'Admin Only',
                description: 'Only receive emails for new admin posts'
            }
        ];

        const userData = {
            firstName: 'Jim',
            lastName: 'Shue',
            tagline: 'Yes, that\'s my real name.',
            email: 'jim@domain.com',
            phone: '520-555-3829',
            languagePrefs: ['English', 'Esperanto'],
            userGroups: ['Tucson, AZ', 'Oro Valley, AZ', 'Marana, AZ'],
            homeGroup: { group_name: 'Tucson, AZ' },
            defaultLocation: 'Tucson, AZ',
            notificationPref: 1,
            currentPic: 'http://lorempixel.com/250/250/nightlife'
        };

        reply.view('home/settings', {
            languageOptions,
            notificationOptions,
            userData,
            title: 'Edit Profile'
        });
    }
};
