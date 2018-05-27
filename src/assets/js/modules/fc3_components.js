import Vue from 'vue';
import { FCVue } from '@freecycle/fc3_common_assets/src/js/modules';
import { VueMasonryPlugin } from 'vue-masonry';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueGoogleMapsCluster from 'vue2-google-maps/dist/components/cluster'

// Vue Configuration & Plugins
Vue.config.silent = true;

// deps
import moment from "moment";

Vue.use(FCVue, {
	moment: moment
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
	mounted() {
		var self = this;
		this.$root.$on(`${this.id}`, function() {
			self.$root.map.currentMarker = self.id
			self.isOpen = true;
			self.$infoWindowObject.open(self.$map);
		});
	}
});
Vue.component('fc-map', VueGoogleMaps.Map);

export const MainVue = new Vue({
	el: '#vue-root',
	props: ['path'],
	data() {
		return {
			posts: {
				layout: 'list',
				filter: null,
				tags: []
			},
			towns: {
				searchQuery: '',
				markers: [],
				filteredMarkers: []
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
			let results = [];
			
			results = this.$lodash.filter(self.towns.markers, function(item, index) {
				return self.$lodash.includes(item.name, self.towns.searchQuery);
			});
			
			self.towns.filteredMarkers = results;
			
			self.$root.$emit('renderCluster');
		},
		townResults(towns) {
			if (this.towns.searchQuery) {
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
		
		this.$on('loadTowns', function(markers) {
			self.towns.markers = markers;
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