

const Hoek = require('hoek');
const Boom = require('boom');

// dummy footer items
const footerMenuItems = [
    'Local Groups',
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
            description: 'an individual post.  use a number, like /posts/123454',
            auth: {},
            plugins: {
                'auth-cookie-freecycle': {
                    redirectTo: false
                }
            }
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

            try {
                request.server.Post.getImageById({ id, thumb }, (err, image) => {

                    Hoek.assert(!err, 'something is wrong: ' + err);
                    if ((image !== null) && image.data && (image.data.length > 0)) {
                        const data = new Buffer.from(image.data, 'latin1');    // after much trial and error this is what works..
                        const size = Buffer.byteLength(data);
                        console.log('image byte length: ' + size);
                        reply(data).bytes(size).type(image.mime_type).header('Content-Disposition', 'inline');
                    }
                    else {
                        const error = Boom.create(499, 'post image ' + id + ' does not exist.');
                        request.log('get-image', e);
                        return reply(error);
                    }
                });
            }
            catch (e) {
                const error = Boom.create(499, 'post image ' + id + ' does not exist.');
                request.log('get-image', e);
                return reply(error);
            }
        }

    }
];
