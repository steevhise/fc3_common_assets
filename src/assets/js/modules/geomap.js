import $ from 'jquery';
import L from 'leaflet';

/**
 * A class wrapper for leaflet, that simplifies the instantiation process.
 * @class {null} GeoMap
 */
export default class GeoMap {
	constructor(instance) {
		
		this.instance = instance;
		this.$element = $(this.instance);

		this.defaultSettings = {
			height: '400',
			width: '100%'
		};

		// this function builds the map.
		this.init();
	}

	/**
	 * Initializes the leaflet map instance.
	 * @return {null} 
	 */
	init() {
		this.settings = JSON.parse(new Array(this.$element.attr('data-geomap-settings'))) || this.defaultSettings;
		this.markers = JSON.parse(new Array(this.$element.attr('data-geomap-markers'))) || [];

		let map = new L.map(this.instance, {
			zoom: 13
		});
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
	}
	
}

$('body').find('[data-geomap]').each(function(idx, item) {
	new GeoMap(item);
});
