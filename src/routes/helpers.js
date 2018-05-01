const ImageUtils = require('@freecycle/common-hapi-plugins/services/images');

exports.formFailAction = (request, reply, source, error) => {

    if (source !== 'payload') {
        return reply(error);
    }

    const validation = {
        error,
        info: error.data.details.map(({ message, path }) => ({ message, path, type: 'form' }))
    };

    request[source] = Object.assign(request[source] || {}, { validation });
    request.app.formValidation = (request.app.formValidation || []).concat(validation.info);

    return reply.continue();
};

exports.validateImagesPre = (request, reply) => {

    if (!request.payload || !request.payload.images) {
        return reply.continue();
    }

    const { images } = request.payload;
    return Promise.all(images.map((img) => ImageUtils.validate(img)))
    .catch((err) => {

        request.app.formValidation = request.app.formValidation || [];
        request.app.formValidation.push({
            type: 'form',
            path: 'image',
            message: err.message
        });

        return;
    })
    .then(() => {

        return reply.continue();
    });
};
