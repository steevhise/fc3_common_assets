module.exports = {
    type: 'onPreResponse',
    method: (request, reply) => {

        if (!request.auth.isAuthenticated) {
            return reply.continue();
        }

        // Only limited response checking here, assumes errors extension ran before
        if (request.response.variety === 'view') {

            const { alertService } = request.server;
            const { id: userId } = request.auth.credentials;

            return alertService.countUnseenForUser(userId)
            .then((count) => {

                request.response.source.context.alertCount = count;
                return reply.continue();
            });
        }

        return reply.continue();
    }
};
