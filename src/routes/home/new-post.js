module.exports = {
    method: 'GET',
    path: '/home/new_post',
    config: {
        id: 'home_post_new',
        description: 'Create a new post.',
        auth: { mode: 'required' }
    },
    handler: function (request, reply) {

        reply.view('home/post_new', {
            title: 'Make A Post',
            inBodyAds: [
                'one', 'two'
            ]
        });
    }
};
