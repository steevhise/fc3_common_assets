import "./modules";

// load the main sass entrypoint so that webpack can compile and extract them to public/assetss/css/main.css
import "../scss/main.scss";

// jQuery
var $ = require('jquery');
global.jQuery = $;

// if you want all features of foundation
require('foundation-sites/dist/js/foundation.min.js');

$(document).ready(function($) {
	$(document).foundation();
});