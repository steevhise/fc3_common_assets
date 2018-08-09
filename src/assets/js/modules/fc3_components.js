import Vue from 'vue';
import { FCVue } from '@freecycle/fc3_common_assets/src/js/modules';
import { VueMasonryPlugin } from 'vue-masonry';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueGoogleMapsCluster from 'vue2-google-maps/dist/components/cluster'
import momentTimezone from "moment-timezone";
import Vuex from 'vuex';
import { MessagingStore } from "../vuex_stores/messaging";
import Fuse from 'fuse.js';

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

// extend FCVue
Vue.prototype.$fuse = Fuse;

// deps
Vue.use(FCVue, {
	momentTimezone: momentTimezone,
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
				center: {},
				zoom: 7,
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
			
			if (self.towns.searchQuery.length > 0) {
				this.towns.filteredMarkers = new this.$fuse(this.towns.markers, {
					shouldSort: true,
					threshold: 0.2,
					location: 0,
					distance: 100,
					maxPatternLength: 32,
					minMatchCharLength: 2,
					keys: [ 'name', 'region.region_name' ]
				}).search(this.towns.searchQuery);
			}

			// self.$root.$emit('renderCluster');
		},
		townResults(towns) {
			if (this.towns.searchQuery.length > 0) {
				return this.towns.filteredMarkers;
			} else {
				return this.towns.markers;
			}
		},
		getMarkerIcon(town) {
			let color = town.membership !== undefined ? '#FF5722' : '#34b233';
			
			return { 
				path: 'M10.75,0A6.25,6.25,0,0,0,4.5,6.25c0,6,6.25,13.75,6.25,13.75S17,12.22,17,6.25A6.25,6.25,0,0,0,10.75,0Zm0,9.7a3.38,3.38,0,1,1,3.38-3.38A3.37,3.37,0,0,1,10.75,9.7Z',
				fillColor: color,
				fillOpacity: 1,
				strokeColor: 'white',
				strokeWeight: 1,
				scale: 2
			}
		}
	},
	filters: {
		groupIdentifier(group) {
			if (!group) {
				return group;
			}
			
			return group.yahoo_group_name || group.uniqueName || group.group_id || group.id || '';
		}
	},
	created() {
		let self = this;
		this.$on('renderCluster', function() {
			if (! (self.towns.memberships.length > 0) ) {
				setTimeout(() => {
					this.$refs.mapcluster.$clusterObject.fitMapToMarkers();
				}, 1000);
			}
		});

		this.$on('loadTowns', function(towns) {
			self.towns.markers = towns.groups;
			self.towns.memberships = towns.memberships;
			
			// add isMember key
			self.towns.markers.forEach(town => {
				town.membership = self.$lodash.find(self.towns.memberships, membership => {
					return town.id === membership.id;
				})
			});
			
			// set the map center based on the first item in the user's group membership
			self.map.center = {
				lat: towns.memberships[0].latitude ? towns.memberships[0].latitude : 33.24,
				lng: towns.memberships[0].longitude ? towns.memberships[0].longitude : -117.36
			}
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
