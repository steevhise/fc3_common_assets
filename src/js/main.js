/**
 * Note: this file is provided by the fc3_common_assets package
 */
import "./modules";

// jQuery
var $ = require('jquery');
global.jQuery = $;

// if you want all features of foundation
require('foundation-sites/dist/js/foundation.min.js');

$(document).ready(function($) {
	$(document).foundation();
});