module.exports = {
    type: 'onPreResponse',
    method: (request, reply) => {

        if (!request.auth.isAuthenticated) {
            return reply.continue();
        }

        if (request.route.settings.id === 'home_myreplies') {
            return reply.continue();
        }

        // Only limited response checking here, assumes errors extension ran before
        if (request.response.variety === 'view') {

            const { messagingService } = request.server;
            const { id: userId } = request.auth.credentials;

            return Promise.resolve()
            .then(() => messagingService._cachedUnreadForUser(userId))
            .then((count) => {

                request.response.source.context.unreadReplies = count;
                return reply.continue();
            })
            .catch((err) => {

                // TODO Silly default, just to prevent any unexpected bugs in this logic from derailing the entire site
                console.log('*** Replies count extension failed, defaulting to 0 ***', err);
                request.response.source.context.unreadReplies = 0;
                return reply.continue();
            });
        }

        return reply.continue();
    }
};
