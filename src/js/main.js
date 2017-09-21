import "./modules";

// jQuery
var $ = require('jquery');
global.jQuery = $;

// if you want all features of foundation
require('foundation-sites/dist/js/foundation.min.js');

//  loading of images for webpack asset management
// var fc3Images = require.context('../images');

// move template partials into right place.
// var fc3Partials = require.context('../views/partials');

// require.context('../scss');


$(document).ready(function($) {
	$(document).foundation();
});