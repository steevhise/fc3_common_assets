module.exports = {
    method: 'GET',
    path: '/',
    config: {
        id: 'pages_sitemap',
        description: 'Simple list of all pages on site.'
    },
    handler: function (request, reply) {

        const routeTable = request.server.table();
        const results = [];

        for (let i = 0; i < routeTable.length; ++i) {
            const route = routeTable[i];

            for (let j = 0; j < route.table.length; ++j) {
                const table = route.table[j];
                if (table.path === '/pages/{pagePath}') {
                }

                // auto-generated route created by hapi-sass, doesn't need to be listed.
                if (table.path === '/css/{file}.css') {
                    continue;
                }

                // exclude a route by adding a tag 'exclude' in the config.
                if (table.public.settings.tags) {
                    i = table.public.settings.tags.indexOf('exclude');
                    if (i > -1) {
                        continue;
                    }
                }
                results.push(table);   // this is an array of {route settings: method: path: etc } hashes.
            }
        }
  // TODO: the static pages need to return all the actual pages.

  // console.log("---------------------");
  // TODO: do some error catching, maybe - like what if there's no results?
        reply.view('sitemap', {
            title: 'Site Map',
            pages: results
        });
    }
};
