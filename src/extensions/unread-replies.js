module.exports = {
    type: 'onPreResponse',
    method: (request, reply) => {

        if (!request.auth.isAuthenticated) {
            return reply.continue();
        }

        // Only limited response checking here, assumes errors extension ran before
        if (request.response.variety === 'view') {

            const { messagingService } = request.server;
            const { id: userId } = request.auth.credentials;

            return messagingService.countUnreadForUser(userId)
            .then((count) => {

                request.response.source.context.unreadReplies = count;
                return reply.continue();
            });
        }

        return reply.continue();
    }
};
