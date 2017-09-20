import "./modules";

// jQuery
var $ = require('jquery');
global.jQuery = $;

// if you want all features of foundation
require('foundation-sites/dist/js/foundation.min.js');

//  loading of images for webpack asset management
require.context("../images");

$(document).ready(function($) {
	$(document).foundation();
});