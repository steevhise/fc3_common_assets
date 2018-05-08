const Hoek = require('hoek');

module.exports = {
    method: 'GET',
    path: '/home/my-posts',
    config: {
        id: 'home_myposts',
        description: 'Posts created by the logged in user.',
        auth:  { mode: 'required' }
    },
    handler: function (request, reply) {

        const { postService } = request.server;
        const { id: userId } = request.auth.credentials;

        // TODO Abstract this pattern into a helper that accepts the error type you're checking for
        // Handles forbidden edit, redirected from edit-post
        const errors = [];
        if (request.state.redirectedError) {
            const { redirectedError } = request.state;
            if (redirectedError.type === 'postModeration') {
                errors.push({
                    message: redirectedError.message
                });
            }
            // Clean up the error cookie to ensure no fraudulent errors on subsequent visits in the session
            reply.unstate('redirectedError');
        }

        return postService.byUser(userId)
        .then((posts) => {

            reply.view('home/my_posts', {
                title: 'My Posts',
                data: {
                    posts
                },
                errors,
                postAction: 'Manage',
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
