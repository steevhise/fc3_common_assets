#Freecycle 3.0

### To Install

Make sure you have node and npm, and then:  
 
1. Make sure you have access to the freecycle npm registry so you can get our private packages: 
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
 
### To Run 
 
*  `npm run start`  - this will auto-launch a browser pointed to the server (via browsersync) and auto-restart when you make changes (nodemon). (Note that browsersync won't start for a few seconds in order to give the web app a chance to get started.)  
     
    You can browse to [localhost:3001](http://localhost:3001) to see browsersync's UI, which is pretty snazzy. 
 
* `npm run serve`  - start app without launching browser or nodemon 
* `npm run dev` - start app with nodemon but no browsersync
 
### Coding/Architecture Guidelines 
* reusable plugins that we want to use in other apps (like ModTools, Group Admin, etc) should be put in the `@freecycle/common-hapi-plugins` npm.
The repo for that is at gitolite@devserver.freecycle.org:common-hapi-plugins
* `src/packages/` is for other code of ours (our unpackaged internal hapi plugins, etc) not contained in the above package or in `src/routes/`, etc 
* keep routes and views organized by section of site: Home, Groups, etc. any js file in the routes dir will get included. 
 
### Frontend
Foundation, JQuery, SASS, blah blah blah.
 
### Stuff there's no mockups of (?): 
 
- [ ] Login/signup (?) 
- [ ] edit profile/settings 
- what else?
 
 
### Backend Esoterica:
* there's now a plugin for a GraphQL query wrapper that should cut down on some boilerplate.  
use it like so:  `server.methods.wrapGraphQL(query, 'user.user_id', function(err, result) { whatever callback stuff... });`
It will return (null, null) for nothing found, (null, queryResult.data) for found data, and (err, null) for errors.
Does this really save anything though? Still have to test for errors. hmm.