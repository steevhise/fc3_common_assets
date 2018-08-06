import Vue from 'vue';
import { FCVue } from '@freecycle/fc3_common_assets/src/js/modules';
import { VueMasonryPlugin } from 'vue-masonry';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueGoogleMapsCluster from 'vue2-google-maps/dist/components/cluster'
import momentTimezone from "moment-timezone";
import Vuex from 'vuex';
import { MessagingStore } from "../vuex_stores/messaging";


// Vue Configuration & Plugins
Vue.config.silent = true;

// Vuex Store
Vue.use(Vuex);
/**
 * Export FC Main's Vuex Store
 * @see src/assets/js/vuex_stores
 */
export const MainStore = new Vuex.Store({
	modules: {
		messaging: MessagingStore
	}
});

// deps
Vue.use(FCVue, {
	momentTimezone: momentTimezone
});

Vue.use(VueMasonryPlugin);
Vue.use(VueGoogleMaps, {
	load: {
		key: 'AIzaSyAyYZ8PZI2VaG6pPyP9kWEpebj_pDPWnhs',
		libraries: 'places'
	}
});

//components
import Modal from '../components/Modal.vue';
Vue.component('fc-modal', Modal);

import Signup from '../components/Signup.vue';
Vue.component('fc-signup', Signup);

import Login from '../components/Login.vue';
Vue.component('fc-login', Login);

import MessagesBoardConnected from '../components/MessagesBoardConnected.vue';
Vue.component('fc-messages-board-connected', MessagesBoardConnected);

import MessagesNotifierConnected from '../components/MessagesNotifierConnected.vue';
Vue.component('fc-messages-notifier-connected', MessagesNotifierConnected);

import FacebookFriends from '../components/FacebookFriends.vue';
Vue.component('fc-facebook-friends', FacebookFriends);

import FacebookMessage from '../components/FacebookMessage.vue';
Vue.component('fc-facebook-message', FacebookMessage);

Vue.component('fc-map-cluster', {
	extends: VueGoogleMapsCluster,
	mounted() {
		this.$nextTick(function() {
			this.$root.$emit('renderCluster');
		})
	}
});

Vue.component('fc-map-marker', VueGoogleMaps.Marker);

Vue.component('fc-map-infowindow', {
	name: 'gmap-info-window',
	extends: VueGoogleMaps.InfoWindow,
	props: {
		id: null,
		opened: {
			default: false
		}
	},
	data() {
		return {
			isOpen: false
		}
	},
	computed: {
		opened() {
			return this.$root.map.currentMarker === this.id;
		}
	},
	mounted() {
		let self = this;
		this.$root.$on(`${this.id}`, function(data) {
			self.$root.map.currentMarker = self.id;
			self.$infoWindowObject.open(self.$map);
			$('.item-list-list-view').trigger('click');
		});
	}
});

Vue.component('fc-map', VueGoogleMaps.Map);

export const MainVue = new Vue({
	el: '#vue-root',
	props: ['path'],
	store: MainStore,
	data() {
		return {
			posts: {
				layout: 'list',
				filter: null,
				tags: [],
				towns: [],
				selectedTown: ''
			},
			towns: {
				searchQuery: '',
				markers: [],
				filteredMarkers: [],
				memberships: []
			},
			map: {
				currentMarker: null,
				center: {
					lat: 33.24,
					lng: -117.36
				},
				markers: [],
				infoWindow: {
					options: {
						pixelOffset: {
							width: 0,
							height: -50
						},
						maxWidth: 380
					},
					open: false,
					currentMidx: null,
					infoWinOpen: false,
				}
			},
		}
	},
	methods: {
		searchTowns() {
			let self = this;
			let results = self.towns.markers || [];
			
			if (self.towns.searchQuery.length > 0) {
				results = this.$lodash.filter(self.towns.markers, function(item, index) {
					return self.$lodash.includes([item.name, item.region.region_name], self.towns.searchQuery);
				});
			}

			self.towns.filteredMarkers = results;

			self.$root.$emit('renderCluster');
		},
		townResults(towns) {
			// add isMember key
			this.towns.markers.forEach(town => {
				town.membership = this.$lodash.find(this.towns.memberships, membership => {
					return town.regionId === membership.region.id;
				});
			});

			if (this.towns.searchQuery.length > 0) {
				return this.towns.filteredMarkers;
			} else {
				return this.towns.markers;
			}
		}
	},
	created() {
		let self = this;
		this.$on('renderCluster', function() {
			setTimeout(() => {
				this.$refs.mapcluster.$clusterObject.fitMapToMarkers();
			}, 1000);
		});

		this.$on('loadTowns', function(towns) {
			self.towns.markers = towns.groups;
			self.towns.memberships = towns.memberships;
		});

		this.$on('requestGeoPermissions', function() {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(function(geo) {
					self.map.center = {
						lat: geo.latitude,
						lng: geo.longitude
					}
				});
			} else {
				console.log("Device does not have GeoLocation Capabilities");
			}
		});
	}
});
