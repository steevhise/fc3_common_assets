import Vue from 'vue';
import { FCVue } from '@freecycle/fc3_common_assets/src/js/modules';

// Vue Configuration & Plugins
Vue.config.silent = true;
Vue.use(FCVue);


//components
import Modal from '../components/Modal.vue';
Vue.component('fc-modal', Modal);

import Signup from '../components/Signup.vue';
Vue.component('fc-signup', Signup);

import Login from '../components/Login.vue';
Vue.component('fc-login', Login);

import Data from '../components/Data.vue';
Vue.component('fc-data', Data);

export const MainVue = new Vue({
	el: '#vue-root'
});