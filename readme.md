**Freecycle 3.0 Common Assets**

This is common front-end javascript, sass, images, icons, and template partials. 
The intent is to make it easily reusable on any of the FC3 web applications,
As well as be a platform for a static site if we need it.

Webpack can be used to copy and/or bundle/compile everything to its proper place in 
each application. See the `webpack.config.js` for (example of) best way to do this.

Recommended: have webpack copy sass and html files into a top-level "build" directory, 
configure your template engine and sass-processor to look there
as well as the usual `./src` location.  
(Or possibly move your local files into `build` as well.)