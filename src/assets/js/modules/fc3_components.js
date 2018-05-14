import Vue from 'vue';
import { FCVue } from '@freecycle/fc3_common_assets/src/js/modules';
import { VueMasonryPlugin } from 'vue-masonry';

// Vue Configuration & Plugins
Vue.config.silent = true;

// deps
import momentTimezone from "moment-timezone";

Vue.use(FCVue, {
	momentTimezone: momentTimezone
});

Vue.use(VueMasonryPlugin);

//components
import Modal from '../components/Modal.vue';
Vue.component('fc-modal', Modal);

import Signup from '../components/Signup.vue';
Vue.component('fc-signup', Signup);

import Login from '../components/Login.vue';
Vue.component('fc-login', Login);

export const MainVue = new Vue({
	el: '#vue-root',
	props: ['path'],
	data() {
		return {
			posts: {
				layout: 'list',
				filter: null,
				tags: []
			}
		}
	}
});
