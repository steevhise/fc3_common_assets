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
import Messages from '../components/Messages.vue';
import MessagesInput from '../components/MessagesInput.vue';
import MessagesBoard from '../components/MessagesBoard.vue';
import MessagesNotifier from '../components/MessagesNotifier.vue';

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
		Vue.filter('mreldate', function(date, time, timezone) {

			const { momentTimezone } = options;

			if (!(time && timezone)) {
				// when no time given, fromNow sets time to 00:00:00 in machine's timezone, can result in odd relative times
				return momentTimezone(date, 'YYYY-MM-DD').fromNow();
			}

			const dateToModify = time ? `${date} ${time}` : date;
			// We standardize to utc (how times are stored in db), as otherwise, moment will first convert the time to the server's local time
			const utc = momentTimezone.utc(dateToModify);

			// Then, convert to the given timezone (default_tz set on group post is on, most likely)
			return utc.tz(timezone).fromNow();
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
		Vue.component('fc-messages', Messages);
		Vue.component('fc-messages-input', MessagesInput);
		Vue.component('fc-messages-board', MessagesBoard);
		Vue.component('fc-messages-notifier', MessagesNotifier);
	}
};
