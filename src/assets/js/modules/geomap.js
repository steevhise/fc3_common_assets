import $ from 'jquery';
import L from 'leaflet';

/**
 * A class wrapper for leaflet, that simplifies the instantiation process.
 * @class {null} GeoMap
 */
export default class GeoMap {
	/**
	 * GeoMap constructor
	 * @param {String} container accepts a container, this will be the map element id
	 * @param {Object} options accepts an object of options to be passed to Leaflet
	 * @param {Object} config configuration options specifically for the map element itself.
	 */
	constructor(container, options, config) {
		this.container = container;
		this.options = options;
		this.config = config || {};

		this.$element = $(`#${this.container}`);

		this.registeredMaps = [];
		this.markers = this.options.markers || [];
		
		this.cssLoaded = false;
		
		this.init();
	}

	/**
	 * Initializes the leaflet map instance.
	 * @return {null} 
	 */
	init() {
		// new L.map(this.container, this.options);
		let map = new L.map(this.container);

		map.locate({setView: true});

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		if (this.markers.length > 0 ) {
			$.each(this.markers, function(idx, item) {
				console.log(item);
				L.marker([item.lat, item.long]).addTo(map)
					.bindPopup(item.description)
					.openPopup();
			});
		}

		this.$element.css({
			height: this.options.height,
			width: this.options.width
		});

		map.invalidateSize(false);

		// upon instantiation push the map to the array.
		this.registeredMaps.push(this.container);
	}
	
}

// create new map instances with respected options,
// be sure to pass a unique id to 

const myGroupsMap = new GeoMap('mygroups_map', {
	height: '200px',
	width: '100%',
	markers: [
		{ lat: 51.5, long: -0.09, description: 'Hello World' }
	]
});
