const Hoek = require('hoek');
const Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/home/edit_post/{postId}',
    config: {
        id: 'home_post_edit',
        description: 'Edit a post',
        auth:  { mode: 'required' },
        plugins: { 'hapiAuthorization': { aclQuery: (id, request, cb) => {

            const userId = request.auth.credentials.id;
            request.log('authorization', 'user is ' + userId);
            // only allow edit of own posts.
            const postId = Number(request.params.postId);

            // get the post and see if post author is same as current user
            // TODO: i'd like this to be scoped such that we can re-use this data in the handler below rather than query the post again.
            new request.server.Post(postId, (err, post) => {

                Hoek.assert(!err, 'Probem getting Post!');

                if (post.user_id === userId) {
                    // allowed
                    cb(null, true);
                }
                else {
                    // not allowed
                    request.log('authorization', 'post author id is ' + post.user_id + ' but current user is ' + userId);
                    cb(Boom.forbidden(), true);
                    // TODO: right now this just pops up a rude error page. later we want to just redirect to the post detail page.
                }
            });
        } } }
    },
    handler: function (request, reply) {

        const inBodyAds = [
            'one', 'two'
        ];

        // retrieve data for post edit  TODO: see above, we should be only querying post once... not sure how to scope it though.
        const postId = Number(request.params.postId);
        queryPost(request.server, postId)
        .then((post) => {

            reply.view('./home/post_edit', {
                inBodyAds,
                title : `Edit Post : ${post.post_id}`,
                post
            });
        });
    }
};

/**
 * A Graphql Query that returns a specific post.
 * @param {string} server the server context
 * @param {number} postId the postId we would like to query   TODO: this should be replaced with new Post object construction.
 */
const queryPost = (server, postId) => {

    const query = `{
        post(post_id:${postId}){
            post_id
            user_id
            group_id
            group {
                group_name
            }
            post_subject
            post_description
            post_location
            postType {
                post_type_name
            }
        }
    }`;

    return server.graphql(server.schema, query)
        .then((queryResults) => {

            console.log(queryResults);
            return queryResults.data.post;
        })
        .catch((error) => {

            console.error(`Query getPost: ${error}`);
            throw error;
        });
};
