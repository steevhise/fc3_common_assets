module.exports = {
    method: '*',
    path: '/admin/pages',
    config: {
        id: 'admin_pages',
        description: 'Create and edit "static" pages.',
        auth: { mode: 'required' },
        plugins: {
            'hapiAuthorization': { role: '1' }    // Only priv type id 1  - note: role has to be a string.
        }
    },
    handler: function (request, reply) {

        // get all the pages. TODO: cache this. probably make it a server method.
        return getPages(request.server)
            .then((result) => {

                if (typeof result === 'string') {

                    if (result !== '0') {
                        return reply.view('error_template', { statusCode: 500, errorTitle: 'Server Error', errorMessage: result });
                    }

                    result = null;
                }

                // Success!
                reply.view('admin/pages', {
                    title: 'Administrate Pages',
                    pages: result
                });
            });
    }
};

// a function to grab all the Page records out of the database.
const getPages = function (server) {   // TODO: refactor this to use PageService from common-hapi-plugins

    const query = `{
      pages {
        page_id
        title
        content
        path
        date_last_modified
        date_created
        author {
          username
          user_id
        }
        published
        last_editor {
          username
          user_id
        }
      }
    }`;

    // console.log('about to query this query: ', query);
    return server.graphql(server.schema, query)
        .then((queryResult) => {

            let retval;
            if (typeof queryResult.data.pages === 'undefined' || queryResult.data.pages === null) {
                retval = '0';
            }
            else if (queryResult.data.pages) {  // we've got data
                retval = queryResult.data.pages;
                // console.log('result from page query is ', retval);
            }
            else {    // put this first?
                retval = queryResult.toString || 'unknown error.';
            }
            return retval;
        });
};
