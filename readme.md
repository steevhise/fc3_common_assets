#Freecycle 3.0

### To Install

Make sure you have node and npm, and then:

1. Be sure you have access to the freecycle npm registry so you can get our private packages:
2. Put this in your `.npmrc` file:

    ```
    registry=http://npm.freecycle.org/
    @f:registry=https://registry.npmjs.org/
    ```

3. Make sure you have an account on our npm registry (ask Steev).
4. Login to the registry with `npm login`. Now you can use npm as usual and everything will load via npm.freecycle.org (you can also browse and log in to [npm.freecycle.org](http://npm.freecycle.org) to see what packages we have).
5. `npm install`
6. `npm run build`
7. `npm run build:javascript`
8. For the cookies and authentication to work right, you need to spoof your local environment to be a freecycle.org host. Usually this is done by adding a localhost alias to your /etc/hosts file like *mymachine.freecycle.org*.

### To Run

* make sure a Redis server is running on localhost, default port, no auth

*  `npm run start`  - this will auto-launch a browser pointed to the server at port 3000 (via browsersync) and auto-restart when you make changes (nodemon). (Note that browsersync won't start for a few seconds in order to give the web app a chance to get started.)

    You can browse to [localhost:3001](http://localhost:3001) to see browsersync's UI, which is pretty snazzy.

* `npm run serve`  - start app without launching browser or nodemon
* `npm run dev` - start app with nodemon but no browsersync. if you do this you get to app on port 8000, not 3000.

* a test user exists on the dev database that you can use to log in to the new site. username: `fc3devtest`  pw: `blahblahblah`

### Coding/Architecture Guidelines
* reusable plugins and modules that we want to use in other apps (like ModTools, Group Admin, etc) should be put in the `@freecycle/common-hapi-plugins` npm.
The repo for that is at `gitolite@devserver.freecycle.org:common-hapi-plugins`
Within that there is now a directory `plugins/` and a directory `modules/` please put things in appropriate place.
* `src/packages/` is for other code of ours (our unpackaged internal hapi plugins, etc) not contained in the above package or in `src/routes/`, etc
* Please keep routes and views organized by section of site: Home, Groups, etc. any js file in the routes dir will get included.
* We are now trying, for back-end code at least, to conform to the [hapi](https://github.com/continuationlabs/eslint-config-hapi) coding style.
To lint your code for this standard, use `npm run lint`.  We will "fix" these things gradually.
You can auto-fix many easy things in code to conform to the style by running `npm run lintfix`.

### Frontend
* Foundation, JQuery, SASS, blah blah blah.
* templating engine is swig-templates. docs for that are at http://node-swig.github.io/swig-templates/
* Note that now all common assets and templates are provided by the `@freecycle/fc3_common_assets` module. install that and then run `npm run build:javascript` and
scss will be copied into `./build/scss`, common view files (partials and icons) will go into `./build/views`. Templates and front-end javascript that are specific to this application still go in `./src/` .
Common files will have a little comment at the top now to remind you where the file comes from.  If you introduce a new file into the common-assets package,
please follow this practice.
The git url for common assets repo is `gitolite@devserver.freecycle.org:fc3_common_assets`

* **Vue components:**  more detailed docs are coming. But know for now that there are a few:
    * fc-login   - login form
    * fc-modal   - for modal popup box
    * fc-form
    * fc-editor  - ckeditor text box
    * fc-callout - error or info messages.

### Backend Esoterica:
GraphQL and Sequelize are used for the Data Access Layer.

GraphQL queries should go through the graphql-wrapper query wrapper module.
use it like so:
```const WGQL = require('@freecycle/common-hapi-plugins/lib/graphql-wrapper');`
WGQL.GraphQLWrapper(server, query, datawanted, function(err, result)  { whatever callback stuff... });```
  <br>Where `datawanted` is a result property you're looking for, like *user.user_id*.
It will return (null, null) for nothing found, (null, queryResult.data) for found data, and (err, null) for errors.
... You do still have to catch errors, but this takes care of some.

### Ops Monitoring
Application will now send out some ops statistics to a statsd server running on local host. if there is none, no worries.
To set one up, you need the statsd npm and the "statsd-zabbix-backend" npm ( see the freecycle fork on github for now, it hasn't been merged into origin) - the statd server will flush to our Zabbix server periodically.
