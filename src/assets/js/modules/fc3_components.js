import Vue from 'vue';
import { FCVue } from '@freecycle/fc3_common_assets/src/js/modules';

// Vue Configuration & Plugins
Vue.config.silent = true;

// deps
import moment from "moment";

Vue.use(FCVue, {
	moment: moment
});

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
			global: {
				postLimit: 5
			}
		}
	}
});