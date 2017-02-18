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
	constructor() {
		this.container = 'geomap';

		this.$element = $(`#geomap`);
		this.registeredMaps = [];

		this.settings = JSON.parse(new Array(this.$element.attr('data-geomap-settings'))) || [];
		this.markers = JSON.parse(new Array(this.$element.attr('data-geomap-markers'))) || [];
		
		this.init();
	}

	/**
	 * Initializes the leaflet map instance.
	 * @return {null} 
	 */
	init() {
		let map = new L.map(this.container);
		map.locate({setView: true});

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		// loop through markers and attach them to the map instance.
		if (this.markers.length > 0 ) {
			$.each(this.markers, function(idx, item) {
				L.marker([item.lat, item.long]).addTo(map)
					.bindPopup(item.description)
					.openPopup();
			});
		}

		this.$element.css({
			height: this.settings.height,
			width: this.settings.width
		});

		map.invalidateSize(false);

		// upon instantiation push the map to the array.
		this.registeredMaps.push(this.container);
	}
	
}

new GeoMap();
