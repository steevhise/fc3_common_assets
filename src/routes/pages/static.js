module.exports = {
    method: 'GET',
    path: '/pages/{pagePath}',
    config: {
        id: 'pages_static',
        description: 'a certain static page stored in database. For example, try /pages/test'
    },
    handler: function (request, reply) {

        const pagePath = request.params.pagePath;
        console.log(pagePath);

        const query = '{ page (where: {path: "' + pagePath + `"})
    {
      page_id
      title
      content
      path
    }
  }`;

        // TODO: cache this  - static pages don't change much so set expire time accordingly
        request.server.graphql(request.server.schema, query)
        .then((queryResult) => {

            let retval;
            if (typeof queryResult.data.page === 'undefined' || queryResult.data.page === null) {
                retval = '404';
            }
            else if (queryResult.data.page) {
                retval = Object.assign({}, queryResult.data.page);
                console.log('result from page query is ', retval);
            }
            else {    // put this first?
                console.log('error', queryResult);
                retval = queryResult.toString || 'unknown error.';
            }
            return retval;
        })
        .then((page) => {

            if (typeof page === 'string') {
            // error of some kind.
                if (page === '404') {
                    reply.view('error_template', { statusCode: 404, errorTitle: 'Not Found', errorMessage: 'Sorry, \'' + request.path + '\' not found.' });
                }
                else {
                    console.log('some other error', page);
                    reply.view('error_template', { statusCode: 500, errorTitle: 'Server Error', errorMessage: page });
                }
            }
            else {   // success!
                reply.view('static_template', {
                    title: page.title,
                    static_content: function pageContent() {

                        return page.content;
                    }
                });
            }
        })
        .catch((reason) => {
          // handle rejected promise
            console.error('page query GraphQL promise rejected. (' + reason + ').');
            throw reason;
        });
    }
};
