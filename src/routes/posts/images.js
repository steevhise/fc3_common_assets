const Joi = require('joi');
const Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/posts/images/{postImageId}/{thumb?}',
    config: {
        id: 'post_images',
        description: 'A single post image, e.g. /posts/images/4090134 - or /posts/images/4090116/thumb',
        validate: {
            params: Joi.object({
                postImageId: Joi.number(),
                thumb: Joi.boolean().truthy('thumb')
            })
        }
    },
    handler: function (request, reply) {

        const { postImageId: id, thumb } = request.params;

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
