import $ from 'jquery';
import gmap from 'google-maps';

// default values that must be available to all map instances
gmap.KEY = 'AIzaSyAF77Fi1J3JmCKUHxEGaGRDVit5E_CTAmQ';

/**
 * A class wrapper for geomap, that simplifies the instantiation process.
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
		
		// loads the google maps api
		gmap.load( (google) => {
			// instantiates a new map instance
			let map = new google.maps.Map(this.instance, {
				zoom: 8,
				center: {lat: 32.5, lng: -110.09}
			});
			
			// create an infoWindow
			let mapInfoWindow = new google.maps.InfoWindow();
			
			let marker, i;
			// loop through the markers and attach them to the map instance
			for (i = 0; i < this.markers.length; i++) { 
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(this.markers[i].lat, this.markers[i].lng),
					map: map
				});

				google.maps.event.addListener(marker, 'click', (function(marker, i) {
					return function() {
						mapInfoWindow.setContent(this.markers[i].description);
						mapInfoWindow.open(map, marker);
					}
				})(marker, i));
			}
		});

		this.$element.css({
			height: this.settings.height,
			width: this.settings.width
		});
	}
	
}

$('body').find('[data-geomap]').each(function(idx, item) {
	new GeoMap(item);
});