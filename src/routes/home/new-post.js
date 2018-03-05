module.exports = {
    method: 'GET',
    path: '/home/new_post',
    config: {
        id: 'home_post_new',
        description: 'Create a new post.',
        auth: { mode: 'required' }
    },
    handler: function (request, reply) {

        const inBodyAds = [
            'one', 'two'
        ];
        reply.view('./home/post_new', {
            inBodyAds,
            title: 'Make A Post'
        });
    }
};
