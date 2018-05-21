/**
 * This module is now converted into a Vue Plugin.
 * https://vuejs.org/v2/guide/plugins.html
 */

// deps
import lodash from 'lodash';

// common components
import Test from '../components/Test.vue';
import Editor from '../components/Editor.vue';
import FormButton from '../components/FormButton.vue';
import Form from '../components/Form.vue';
import Callout from '../components/Callout.vue';
import Help from '../components/Help.vue';
import FeaturedIn from '../components/FeaturedIn.vue';
import PostListItem from '../components/PostListItem.vue';
import PostGridItem from '../components/PostGridItem.vue';
import Icon from '../components/Icon.vue';
import Data from '../components/Data.vue';

export const FCVue = {
	install(Vue, options) {
		Vue.prototype.$bus = new Vue();
		Vue.prototype.$lodash = lodash;
		Vue.prototype.$findOne = (haystack, arr) => {
			return arr.some(val => haystack.includes(val));
		};
		
		Vue.prototype.geoFormat = (lat, lng) => {
			return { lat : Number(lat), lng : Number(lng) };
		};

		// filters
		Vue.filter('mreldate', function(date) {
			return options.moment(date, 'ddd MMM D YYYY H:mm:ss').fromNow();
		});

		// register components
		Vue.component('fc-test', Test);
		Vue.component('fc-editor', Editor);
		Vue.component('fc-formbutton', FormButton);
		Vue.component('fc-form', Form);
		Vue.component('fc-callout', Callout);
		Vue.component('fc-help', Help);
		Vue.component('fc-featuredin', FeaturedIn);
		Vue.component('fc-post-list-item', PostListItem);
		Vue.component('fc-post-grid-item', PostGridItem);
		Vue.component('fc-icon', Icon);
		Vue.component('fc-data', Data);
	}
}