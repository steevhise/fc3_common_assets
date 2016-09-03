'use strict';

/*
This is for restricted sections of the site that control and administrate the site, functions sepratate from Mod Tools and Group Admin.

 */

// route definitions
module.exports = [
    {
        method: 'GET',
        path: '/admin/pages',
        config: {
            id: 'Page Administration',
            description: 'this is for creating and editing "static" pages.',
            auth: "session",
            plugins: {
                'hapiAuthorization': {role: '1'}    // Only priv type id 1  - note: role has to be a string.
            },
        },
        handler: function (request, reply) {
            // get all the pages. TODO: cache this. probably make it a server method.
            return getPages(request.server)
                .then(function(result) {
                    if(typeof result === 'string') {
                        // error of some kind, or just no results from the query.
                        if(result === '0') {
                            console.log('no pages found');
                            result = null;
                        } else {
                            console.log('some other error', result);
                            reply.view('error_template', { statusCode: 500, errorTitle: "Server Error", errorMessage: result});
                        }
                    }  else {   // success!
                        //console.log('result is ', result);
                        reply.view('admin/pages', {
                            title: "Administrate Pages",
                            pages: result
                        });
                    }
                });
        }
    },
    {
        method: 'GET',
        path: '/admin/verboten',
        config: {
            id: "verboten",
            description: 'this is a sample forbidden page.',
            auth: "session",
            plugins: {
                'hapiAuthorization': {role: '100'}    // Only priv type id 1  - note: role has to be a string.
            },
        },
        handler: function (request, reply) {
            reply('you are cool, i guess');
        }
    }
];


// a function to grab all the Page records out of the database.
const getPages = function(server) {   // i think we have to make this function thenable. ??
    var query = `{
  pages 
  {
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
        .then(function(queryResult) {
            var retval;
            if (typeof queryResult.data.pages === 'undefined' || queryResult.data.pages === null) {
                retval = "0";
            }
            else if (queryResult.data.pages) {  // we've got data
                retval = queryResult.data.pages;
                // console.log('result from page query is ', retval);
            } else {    // put this first?
                console.log('error', queryResult);
                retval = queryResult.toString || 'unknown error.';
            }
            return retval;
        })
        .catch(function (reason) {
            // handle rejected promise
            console.error('pages query GraphQL promise rejected. (' + reason + ').');
            throw reason;
        });

};