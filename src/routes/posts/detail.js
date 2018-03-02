module.exports = {
    method: 'GET',
    path: '/posts/{postId}',
    config: {
        id: 'posts_detail',
        description: 'an individual post.  use a number, like /posts/123454'
    },
    handler: function (request, reply) {

        const inBodyAds = [
            'one',
            'two'
        ];

        const postId = Number(request.params.postId);
        request.log('debug', 'about to look up post ' + postId);

        new request.server.Post(postId, (err, post) => {

            if (err) {
                return reply(err);
            }

            reply.view('posts/post', {
                showFilterSelectors: true,
                inBodyAds,
                post
            });
        });
    }
};
