module.exports = {
    type: 'onPreAuth',
    method: (request,reply) => {

        // Bypass auth for CSS route.  // TODO: this will go away when we use webpack to compile SASS instead of hapi-sass
        // It's a hack until we can adjust hapi-sass to create a handler-type rather than a fully-configured route.
   /*     if (request.route.path === '/css/{file}.css')            {
            request.auth.credentials = 'bypass';
        }
*/
        return reply.continue();
    }
};
