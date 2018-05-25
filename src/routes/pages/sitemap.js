const internals = {};

module.exports = {
    method: 'GET',
    path: '/sitemap',
    config: {
        id: 'pages_sitemap',
        description: 'Simple list of all pages on site.',
        pre: [
            {
                assign: 'staticPages',
                method: (request, reply) => {

                    const { pageService } = request.server;

                    return pageService.fetchAll()
                        .then((pages) => pages.filter((p) => p.published))
                        .then(reply)
                        .catch(reply);
                }
            }
        ]
    },
    handler: function (request, reply) {

        const { connection, pre: { staticPages } } = request;
        const routes = connection.table().filter((route) => {

            const tags = [].concat(route.settings.tags || []);

            if (tags.includes('api') || tags.includes('exclude')) {
                return false;
            }

            if (route.path === '/pages/{pagePath}') {
                return false;
            }

            return true;
        });

        return reply.view('sitemap', {
            title: 'Site Map',
            data: {
                pages: [].concat(
                    routes.map(internals.routeToSitemapItem),
                    staticPages.map(internals.staticPageToSitemapItem)
                )
            }
        });
    }
};

internals.routeToSitemapItem = (route) => ({
    slug: route.settings.id,
    path: route.path,
    description: route.settings.description || ''
});

internals.staticPageToSitemapItem = (staticPage) => ({
    slug: null,
    path: `/pages/${staticPage.path}`,
    description: staticPage.title
});
