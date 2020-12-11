/**
 * This module is now converted into a Vue Plugin.
 * https://vuejs.org/v2/guide/plugins.html
 */

// deps
import lodash from 'lodash';
import moment from 'moment-timezone';
import haversine from 'haversine';

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

		Vue.prototype.geoDistance = haversine;

		// filters
		Vue.filter('mreldate', function(date, time, timezone) {

			moment.locale(Vue.i18nOptions.lng);    // language set in top-level fc3_components.js.

			if (!(time && timezone)) {
				// when no time given, fromNow sets time to 00:00:00 in machine's timezone, can result in odd relative times
				return moment(date, 'YYYY-MM-DD').fromNow();
			}

			// post search results from Elasticsearch are a full datetime string, which breaks this concat, so we
			// step over it in that case.
			const dateToModify = time && time.length < 11 ? `${date} ${time}` : date;
			// We standardize to utc (how times are stored in db), as otherwise, moment will first convert the time to the server's local time
			const utc = moment.utc(dateToModify);

			// Then, convert to the given timezone (default_tz set on group post is on, most likely)
			return utc.tz(timezone).fromNow();
		});

		// this filter strips html tags from text and returns the raw text
		Vue.filter('stripTags', function(text) {
			let regex = /(<([^>]+)>)|&nbsp;|&quot;/gim;
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

		// convert string to first uppercase, rest lowercase
		Vue.filter('firstupper', function(text) {
			return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
		});

		Vue.component('fc-button', () => import('../components/Button.vue'));
		Vue.component('fc-callout', () => import('../components/Callout.vue'));
		Vue.component('fc-data', () => import('../components/Data.vue'));
		Vue.component('fc-editor', () => import('../components/Editor.vue'));
		Vue.component('fc-featuredin', () => import('../components/FeaturedIn.vue'));
		Vue.component('fc-form', () => import('../components/Form.vue'));
		Vue.component('fc-formbutton', () => import('../components/FormButton.vue'));
		Vue.component('fc-help', () => import('../components/Help.vue'));
		Vue.component('fc-icon', () => import('../components/Icon.vue'));
		Vue.component('fc-item-header', () => import('../components/ItemHeader.vue'));
		Vue.component('fc-lend-friends-select', () => import('../components/LendFriendsSelect.vue'));
		Vue.component('fc-lend-message', () => import('../components/LendMessage.vue'));
		Vue.component('fc-messages', () => import('../components/Messages.vue'));
		Vue.component('fc-messages-board', () => import('../components/MessagesBoard.vue'));
		Vue.component('fc-messages-detail-input', () => import('../components/MessagesDetailInput.vue'));
		Vue.component('fc-messages-notifier', () => import('../components/MessagesNotifier.vue'));
		Vue.component('fc-messages-topics', () => import('../components/MessagesTopics.vue'));
		Vue.component('fc-post-grid-item', () => import('../components/PostGridItem.vue'));
		Vue.component('fc-post-icon', () => import('../components/PostIcon.vue'));
		Vue.component('fc-post-list-item', () => import('../components/PostListItem.vue'));
		Vue.component('fc-spinner', () => import('../components/Spinner.vue'));
		Vue.component('fc-test', () => import('../components/Test.vue'));
		Vue.component('fc-user-search-results', () => import('../components/UserSearchResults.vue'));
	}
};
