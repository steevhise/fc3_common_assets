/**
 * This module is now converted into a Vue Plugin.
 * https://vuejs.org/v2/guide/plugins.html
 */

// common components
import Test from '../components/Test.vue';
import Editor from '../components/Editor.vue';
import FormButton from '../components/FormButton.vue';
import Form from '../components/Form.vue';
import Callout from '../components/Callout.vue';
import Help from '../components/Help.vue';
import FeaturedIn from '../components/FeaturedIn.vue';
import PostListItem from '../components/PostListItem.vue';

export const FCVue = {
	install(Vue, options) {
		Vue.prototype.$bus = new Vue();

		// filters
		Vue.filter('mreldate', function(date) {
			return Moment(date, 'ddd MMM D YYYY H:mm:ss').fromNow();
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
	}
}