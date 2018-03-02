const Boom = require('boom');

module.exports = {
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
};
