module.exports = {
    type: 'onPreHandler',
    method: (request, reply) => {

        // TODO const { alertService } = request.server;
        const { alertCount } = request.state;

        if (!request.auth.isAuthenticated || alertCount) {
            return reply.continue();
        }

        // TODO alertService.countForUser(userId), promisify below
        // NOTE we don't care about state of cache here
        // if user deletes cookie other than by visiting alerts page
        // e.g. closing window, manually deleting
        // Their next authenticated request would retrieve the cached count; is this ok?
        // QUESTION Do we want to invalidate the cache here and retrieve an updated count?
          // That could happen fairly often as configured currently (no cookie TTL)
          // Don't we want this to be as accurate as possible, though, as often as possible?
          // How expensive is the operation? i.e. ok to run often?
        reply.state('alertCount', `${3}`);
        request.state.alertCount = 3; // TODO Inadvisable??? ASK
        return reply.continue();
    }
};
