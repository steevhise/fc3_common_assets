exports.formFailAction = (request, reply, source, error) => {

    if (source !== 'payload') {
        return reply(error);
    }

    const validation = {
        error,
        info: error.data.details.map(({ message, path }) => ({ message, path, type: 'form' }))
    };

    request[source] = Object.assign(request[source] || {}, { validation });
    request.app.formValidation = validation.info;

    return reply.continue();
};
