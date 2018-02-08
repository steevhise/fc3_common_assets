

const Hoek = require('hoek');
const Boom = require('boom');

// dummy footer items
const footerMenuItems = [
    'Local Towns',
    'Merchandise',
    'Donate',
    'Privacy',
    'About',
    'Sponsors',
    'Volunteer',
    'Terms',
    'News',
    'Help',
    'Contact',
    'Wiki'];

// route definitions
module.exports = [
    {
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

                Hoek.assert(!err, 'Probem getting Post!');
                console.log('returned from Post constructor:');
                console.log(post);

                reply.view('posts/post.html', {
                    showFilterSelectors: true,
                    inBodyAds,
                    // title: "Post #" + post_id,
                    footerMenuItems,
                    post
                });
            });
        }
    },
    {
        method: 'GET',
        path: '/posts/images/{postImageId}/{thumb?}',
        config: {
            id: 'post_images',
            description: 'a single post image, e.g. /posts/images/4090134 - or /posts/images/4090116/thumb'
        },
        handler: function (request, reply) {

            const id = Number(request.params.postImageId);
            const thumb = request.params.thumb;

            // grab the image and return content-type header and data

            const fail = (err) => {

                if (err) {
                    request.log(['get-image', 'error'], err);
                }

                return reply(Boom.create(499, `post image ${id} does not exist.`));
            };

            try {
                request.server.Post.getImageById({ id, thumb }, (err, image) => {

                    if (err) {
                        return fail(err);
                    }

                    if (!image || !image.data) {
                        return fail();
                    }

                    return reply(image.data)
                        .type(image.mime_type)
                        .header('Content-Disposition', 'inline');
                });
            }
            catch (err) { // TODO this catch should not be necessary– errors should come from callback
                return fail(err);
            }
        }

    }
];
