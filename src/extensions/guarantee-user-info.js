/*
    Backwards compatibility measure; ensures legacy users
    have an associated user_info record, on which functions throughout the site depend
    user_info is a new table in the FC3 project
*/
module.exports = {
    type: 'onPostAuth',
    method: (request, reply) => {

        // facebook-auth'd requests cause the guaranteeUserInfo call to choke
        // those requests are authenticated, but have no Freecycle user id in their credentials
        // Note in those cases (fb-login, signup, connect) we give the user an FC cookie / manually validate their existing one
        if (!request.auth.isAuthenticated || request.auth.strategy === 'facebook') {
            return reply.continue();
        }

        const { userService } = request.server;
        const { id, info } = request.auth.credentials;

        if (info) {
            return reply.continue();
        }

        return userService.guaranteeUserInfo(id)
        .then(() => reply.continue())
        .catch(reply);
        //TODO Better error handling? What do we want to do
        // when an "internal setup" task like this fails i.e. not apparent to user,
        // but ensures app's in a state for the site to work for them? i.e. user-invisible dependency failed?
        // sorry....thinking/brain-shitting aloud at this point :)
    }
};
