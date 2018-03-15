const Debug = require('debug')('freecycle:fc3_main:error-extension');

module.exports = {
    type: 'onPreResponse',
    method: (request, reply) => {

        const { response } = request;

        if (!response.isBoom) {

            if (request.response.variety === 'view') {
                request.response.source.context.errors = []
                    .concat(request.response.source.context.errors || [])
                    .concat(request.app.formValidation || [])
            }

            return reply.continue();
        }

        // Some default error messages if we don't receive a custom one.
        const statusCodes = {
            401: 'Please Login to view that page',
            400: 'Sorry, we do not have that page.',
            404: 'Sorry, that page is not available.',
            499: 'Image does not exist.'
        };

        const { statusCode } = response.output;
        let { message } = response.output.payload;

        if (!message) {
            message = statusCodes[statusCode];
        }

        Debug('error message: ', message);
        Debug('status code: ', statusCode);

        // Ensure the error is logged even though we know how to handle it
        request.log('error', request.response);

        // TODO: we could pass other things to the template too, like  errorTitle, moreInfo..

        return reply.view('error_template', { statusCode, errorMessage: message }).code(statusCode);
    }
};
