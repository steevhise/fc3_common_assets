import "./modules";

// jQuery
var $ = require('jquery');
global.jQuery = $;

// if you want all features of foundation
require('foundation-sites/dist/foundation.min.js');

$(document).ready(function($) {
	$(document).foundation();
});