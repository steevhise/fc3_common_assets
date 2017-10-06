import "./modules";
import '../../../node_modules/@freecycle/fc3_common_assets/src/js/modules'

// jQuery
var $ = require('jquery');
global.jQuery = $;

// if you want all features of foundation
require('foundation-sites/dist/js/foundation.min.js');

$(document).ready(function($) {
	$(document).foundation();
});