/**
 * This module is now converted into a Vue Plugin.
 * https://vuejs.org/v2/guide/plugins.html
 */

// deps
import lodash from 'lodash';
import moment from 'moment-timezone'

// common components
import Button from '../components/Button.vue';
import Callout from '../components/Callout.vue';
import Data from '../components/Data.vue';
import Editor from '../components/Editor.vue';
import FeaturedIn from '../components/FeaturedIn.vue';
import Form from '../components/Form.vue';
import FormButton from '../components/FormButton.vue';
import Help from '../components/Help.vue';
import Icon from '../components/Icon.vue';
import ItemHeader from '../components/ItemHeader.vue';
import LendFriendsSelect from '../components/LendFriendsSelect.vue';
import LendMessage from '../components/LendMessage.vue';
import Messages from '../components/Messages.vue';
import MessagesBoard from '../components/MessagesBoard.vue';
import MessagesDetailInput from '../components/MessagesDetailInput.vue';
import MessagesNotifier from '../components/MessagesNotifier.vue';
import MessagesTopics from '../components/MessagesTopics.vue';
import PostGridItem from '../components/PostGridItem.vue';
import PostIcon from '../components/PostIcon.vue';
import PostListItem from '../components/PostListItem.vue';
import Spinner from '../components/Spinner.vue';
import Test from '../components/Test.vue';
import UserSearchResults from '../components/UserSearchResults.vue';

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

			moment.locale(Vue.i18nOptions.lng);    // language set in top-level fc3_components.js.

			if (!(time && timezone)) {
				// when no time given, fromNow sets time to 00:00:00 in machine's timezone, can result in odd relative times
				return moment(date, 'YYYY-MM-DD').fromNow();
			}

			const dateToModify = time ? `${date} ${time}` : date;
			// We standardize to utc (how times are stored in db), as otherwise, moment will first convert the time to the server's local time
			const utc = moment.utc(dateToModify);

			// Then, convert to the given timezone (default_tz set on group post is on, most likely)
			return utc.tz(timezone).fromNow();
		});

		// this filter strips html tags from text and returns the raw text
		Vue.filter('stripTags', function(text) {
			let regex = /(<([^>]+)>)|&nbsp;/ig;
			return text.replace(regex, "");
		});

		// this filter is used to truncate a text and add ellipsis or a specified clamping mechanism.
		Vue.filter('truncate', function (text, length, clamp) {
			clamp = clamp || '...';
			length = length || 30;

			if (text.length <= length) return text;

			var tcText = text.slice(0, length - clamp.length);
			var last = tcText.length - 1;


			while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1;

			// Fix for case when text dont have any `space`
			last = last || length - clamp.length;

			tcText = tcText.slice(0, last);

			return tcText + clamp;
		});

		// convert a given string to lowerCase
		Vue.filter('lower', function(text) {
			return String(text).toLowerCase();
		});

		// register components
		Vue.component('fc-button', Button);
		Vue.component('fc-callout', Callout);
		Vue.component('fc-data', Data);
		Vue.component('fc-editor', Editor);
		Vue.component('fc-featuredin', FeaturedIn);
		Vue.component('fc-form', Form);
		Vue.component('fc-formbutton', FormButton);
		Vue.component('fc-help', Help);
		Vue.component('fc-icon', Icon);
		Vue.component('fc-item-header', ItemHeader);
		Vue.component('fc-lend-friends-select', LendFriendsSelect);
		Vue.component('fc-lend-message', LendMessage);
		Vue.component('fc-messages', Messages);
		Vue.component('fc-messages-board', MessagesBoard);
		Vue.component('fc-messages-detail-input', MessagesDetailInput);
		Vue.component('fc-messages-notifier', MessagesNotifier);
		Vue.component('fc-messages-topics', MessagesTopics);
		Vue.component('fc-post-grid-item', PostGridItem);
		Vue.component('fc-post-icon', PostIcon);
		Vue.component('fc-post-list-item', PostListItem);
		Vue.component('fc-spinner', Spinner);
		Vue.component('fc-test', Test);
		Vue.component('fc-user-search-results', UserSearchResults);
	}
};
