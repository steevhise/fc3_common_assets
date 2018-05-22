module.exports = {
    method: 'GET',
    path: '/sitemap',
    config: {
        id: 'pages_sitemap',
        description: 'Simple list of all pages on site.'
    },
    handler: function (request, reply) {

        const routeTable = request.server.table();
        const results = [];

        console.log(routeTable.length);

        for (let i = 0; i < routeTable.length; ++i) {
            const route = routeTable[i];
            const l = route.table.length;
            for (let j = 0; j < l; ++j) {
                console.log('j', j);
                const table = route.table[j];
                console.log(table.public.path);
                if (table.public.path === '/pages/{pagePath}') {
                    // TODO: the 'static' pages need to return all the actual pages. so we'll have to look in database.
                    continue;
                }

                // exclude a route by adding a tag 'exclude' in the config.
                if (!!table.public.settings.tags) {
                    if (table.public.settings.tags.includes('api') ||  table.public.settings.tags.includes('exclude')) {
                        console.log('excluding ', table.public.path);
                        continue;
                    }
                }

                results.push(table.public);   // this is an array of {route settings: method: path: etc } hashes.
            }
        }

  // console.log("---------------------");
  // TODO: do some error catching, maybe - like what if there's no results?
        reply.view('sitemap', {
            title: 'Site Map',
            pages: results
        });
    }
};
