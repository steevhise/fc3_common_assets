#Freecycle 3.0

## Notes

* **To install:** make sure you have node and npm, and then: 

    1. Make sure you have access to the freecycle npm registry so you can get our private packages:
    2. Put this in your `.npmrc` file:
    `registry=http://npm.freecycle.org/`
    `@f:registry=https://registry.npmjs.org/`
    3. Then, make sure you have an account on the registry. Ask Steev.
    Once you do, login with `npm login`
    Now you can use npm as usual and everything will load via npm.freecycle.org
    ( you can also browse and log in to http://npm.freecycle.org to see what packages we have )
    4. `npm install`

* to run:  
`npm run start`  - this will auto-launch a browser pointed to the server (via browsersync) and auto-restart when you make changes (nodemon)
(Note that browsersync won't start for a few seconds in order to give the web app a chance to get started.) 
You can browse to localhost:3001  to see browsersync's UI, which is pretty snazzy.
`npm run serve`  - start app without launching browser or nodemon

## Coding/Architecture Guidelines
* src/packages is for other code of ours (our unpackaged internal hapi plugins, etc) not contined in routes, etc
* keep routes and views organized by section of site: Home, Groups, etc


##Frontend:


### stuff there's no mockups of (?):
 Login/signup (?),  edit profile/settings, .... what else?


