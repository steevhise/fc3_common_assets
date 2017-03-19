import $ from 'jquery';
import gmap from 'google-maps';

// default values that must be available to all map instances
gmap.KEY = 'AIzaSyAF77Fi1J3JmCKUHxEGaGRDVit5E_CTAmQ';
gmap.LIBRARIES = ['places'];

/**
 * A class wrapper for geomap, that simplifies the instantiation process.
 * @class {null} GeoMap
 */
export default class GeoMap {
	constructor(instance) {
		
		this.instance = instance;
		this.$element = $(this.instance);
		this.markerIcons = {};

		this.defaultSettings = {
			height: '400',
			width: '100%'
		};

		// initialize the default marker icons.
		this.initIcons();

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
		
		let geoLocation;
		
		navigator.geolocation.getCurrentPosition( (position) =>  {
			geoLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}
		});
		
		// loads the google maps api
		gmap.load( (google) => {
			// instantiates a new map instance
			let map = new google.maps.Map(this.instance, {
				zoom: 8,
				center: {lat: 32.5, lng: -110.09}
			});
			
			map.setCenter(geoLocation ? geoLocation : map.getCenter());

			// create an infoWindow
			let mapInfoWindow = new google.maps.InfoWindow();
			
			let marker, i;
			let mapLocations = this.markers;
			
			// loop through the markers and attach them to the map instance
			for (i = 0; i < mapLocations.length; i++) {
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(Number(mapLocations[i].lat), Number(mapLocations[i].lng)),
					icon : this.getIcon(mapLocations[i]),
					map: map
				});

				google.maps.event.addListener(marker, 'click', (function(marker, i) {
					return function() {
						mapInfoWindow.setContent(mapLocations[i].description);
						mapInfoWindow.open(map, marker);
					}
				})(marker, i));
			}
		});

		this.$element.css({
			height: this.settings.height,
			width: this.settings.width
		});
	};

	/**
	 * Initialize the setup of the default marker icons.
	 * note a marker icon may be passed as an object, by which it will be used to register a new marker icon,
	 * upon instantiation. 
	 * A marker icon may also be passed a string, the string must be the url of a marker icon accessible via
	 * the web.
	 * 
	 * @method initIcons
	 * @return {null}
	 */
	initIcons() {
		let settings = {
			basePath : 'M10.75,0A6.25,6.25,0,0,0,4.5,6.25c0,6,6.25,13.75,6.25,13.75S17,12.22,17,6.25A6.25,6.25,0,0,0,10.75,0Zm0,9.7a3.38,3.38,0,1,1,3.38-3.38A3.37,3.37,0,0,1,10.75,9.7Z'
		};

		let icons = {
			default : {
				path : settings.basePath,
				fillColor : '#34b233',
				fillOpacity : 0.8,
				strokeColor : 'white',
				scale : 2
			},
			group : {
				path : settings.basePath,
				fillColor : '#ff5722',
				fillOpacity : 0.8,
				strokeColor : 'white',
				scale : 2
			},
			user : {
				path : settings.basePath,
				fillColor : '#00bcd4',
				fillOpacity : 0.8,
				strokeColor : 'white',
				scale : 2
			},
			post : {
				path : settings.basePath,
				fillColor : '#673AB7',
				fillOpacity : 0.8,
				strokeColor : 'white',
				scale : 2
			}
		};

		this.markerIcons = icons;
	};

	/**
	 * This function accepts a string or object with key custom.
	 * Primarily used when building the map markers to determine,
	 * which icon should be rendered with the marker.
	 * 
	 * @method getIcon
	 * @param {string|object} config 
	 */
	getIcon(config) {
		if (typeof config.icon === 'string') {
			return this.markerIcons[config.icon];
		} else if (typeof config.icon === 'object' && config.icon.custom !== undefined) {
			return config.icon.custom;
		} else {
			// if all else fails return a default marker icon.
			return this.markerIcons.default;
		}
	}
	
}

$('body').find('[data-geomap]').each(function(idx, item) {
	new GeoMap(item);
});