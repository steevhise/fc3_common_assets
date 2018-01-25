module.exports = {
    type: 'onPreResponse',
    method: (request,reply) => {

        const { response } = request;

        if (!response.isBoom) {
            return reply.continue();
        }

        const { statusCode } = response.output;
        const { message } = response.output.payload;

        // TODO: hapi-error plugin had option to pass in default messages for status codes.
        /*statusCodes: {
            499: { message: 'Please login to view that page' }
      401: { message: 'Please Login to view that page' },
      400: { message: 'Sorry, we do not have that page.' },
      404: { message: 'Sorry, that page is not available.' }
    }
        }*/

        return reply.view('./error_template', { statusCode, message }).code(statusCode);
    }
};

