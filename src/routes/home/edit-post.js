const Joi = require('joi');
const Hoek = require('hoek');
const Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/home/edit-post/{postId}',
    config: {
        id: 'home_post_edit',
        description: 'Edit a post',
        auth:  { mode: 'required' },
        validate: {
            params: Joi.object({
                postId: Joi.number()
            })
        },
        plugins: { 'hapiAuthorization': { aclQuery: (id, request, cb) => {

            const userId = request.auth.credentials.id;
            request.log('authorization', 'user is ' + userId);

            // only allow edit of own posts.
            const { postId } = request.params;

            // get the post and see if post author is same as current user
            // TODO: i'd like this to be scoped such that we can re-use this data in the handler below rather than query the post again.
            new request.server.Post(postId, (err, post) => {

                if (err) {
                    return cb(err);
                }

                if (post.user_id !== userId) {
                    // not allowed
                    // TODO: right now this just pops up a rude error page. later we want to just redirect to the post detail page.

                    request.log('authorization', 'post author id is ' + post.user_id + ' but current user is ' + userId);

                    return cb(Boom.forbidden());
                }

                // allowed
                return cb(null, true);
            });
        } } }
    },
    handler: function (request, reply) {

        // retrieve data for post edit  TODO: see above, we should be only querying post once... not sure how to scope it though.
        const { postId } = request.params;

        return queryPost(request.server, postId).then((post) => {

            reply.view('home/post_edit', {
                title: `Edit Post : ${post.post_id}`,
                post,
                inBodyAds: [
                    'one', 'two'
                ]
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
        .then(({ data }) => {

            if (!data || !data.post) {
                throw Boom.notFound('Post not found');
            }

            return data.post;
        });
};
