#Freecycle 3.0

### To Install

Make sure you have node and npm, and then:  
 
1. Be sure you have access to the freecycle npm registry so you can get our private packages: 
2. Put this in your `.npmrc` file:
    
    ```
    registry=http://npm.freecycle.org/ 
    @f:registry=https://registry.npmjs.org/ 
    ```

3. Make sure you have an account on the registry (ask Steev). 
4. Login with `npm login`. Now you can use npm as usual and everything will load via npm.freecycle.org (you can also browse and log in to [npm.freecycle.org](http://npm.freecycle.org) to see what packages we have). 
5. `npm install` 
6. `npm run build`
7. `npm run build:trumbowyg` (this installs the wysiwyg page editor)
8. For the cookies and authentication to work right, you need spoof your local environment to be a freecycle.org host. Usually this is done by adding a localhost alias to your /etc/hosts file like *mymachine.freecycle.org*.
 
### To Run 
 
*  `npm run start`  - this will auto-launch a browser pointed to the server at port 3000 (via browsersync) and auto-restart when you make changes (nodemon). (Note that browsersync won't start for a few seconds in order to give the web app a chance to get started.)  
     
    You can browse to [localhost:3001](http://localhost:3001) to see browsersync's UI, which is pretty snazzy. 
 
* `npm run serve`  - start app without launching browser or nodemon 
* `npm run dev` - start app with nodemon but no browsersync. if you do this you get to app on port 8000, not 3000.

* a test user exists on the dev database that you can use to log in to the new site. username: `fc3devtest`  pw: `blahblahblah`
 
### Coding/Architecture Guidelines 
* reusable plugins and modules that we want to use in other apps (like ModTools, Group Admin, etc) should be put in the `@freecycle/common-hapi-plugins` npm.
The repo for that is at gitolite@devserver.freecycle.org:common-hapi-plugins
Within that there is now a directory `plugins/` and a directory `modules/` please put things in appropriate place.
* `src/packages/` is for other code of ours (our unpackaged internal hapi plugins, etc) not contained in the above package or in `src/routes/`, etc 
* Please keep routes and views organized by section of site: Home, Groups, etc. any js file in the routes dir will get included. 
* We are now trying to use the [semistandard](https://github.com/Flet/semistandard) coding style. Thoughts are welcome about that.
To lint your code for this standard, use `npm run lint`.  We will "fix" these things gradually.
[![js-semistandard-style](https://cdn.rawgit.com/flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)
 
### Frontend
* Foundation, JQuery, SASS, blah blah blah.
* templating engine is swig-templates. docs for that are at http://node-swig.github.io/swig-templates/
 
### Stuff there's no mockups of (?): 
 
- [ ] Login/signup (?) 
- [ ] edit profile/settings 
- [ ] pretty much all of ModTools and GroupAdmin
- what else?
 
 
### Backend Esoterica:
* now the GraphQL query wrapper is a regular module not a hapi plugin.  
use it like so:  
`var WGQL = require('@freecycle/common-hapi-plugins/lib/graphql-wrapper');`
`WGQL.GraphQLWrapper(server, query, datawanted, function(err, result)  { whatever callback stuff... });`
where datawanted is a result property you're looking for, like *user.user_id*.
It will return (null, null) for nothing found, (null, queryResult.data) for found data, and (err, null) for errors.
... Does this really save anything though? Still have to test for errors. hmm.
