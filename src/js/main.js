/**
 * Note: this file is provided by the fc3_common_assets package
 */
import "./modules";

// load styles for webpack to bundle and build .css
import "../scss/main.scss";

// jQuery
var $ = require('jquery');
global.jQuery = $;

// if you want all features of foundation
require('foundation-sites/dist/js/foundation.min.js');

$(document).ready(function($) {
	$(document).foundation();
});