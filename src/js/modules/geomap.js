/**
* Note: this file is provided by the fc3_common_assets package
 */
import $ from 'jquery';
import gmap from 'google-maps';

// default values that must be available to all map instances
gmap.KEY = 'AIzaSyAyYZ8PZI2VaG6pPyP9kWEpebj_pDPWnhs';
gmap.CLIENT = 'gme-thefreecyclenetwork';    // use this instead of api key, supposedly better reporting options.
gmap.LIBRARIES = ['places'];

/**
 * A class wrapper for geomap, that simplifies the instantiation process.
 * @class {null} GeoMap
 */
export default class GeoMap {
	constructor() {
		// setup
		// TODO All of this is BANDAIDS!!! :) This module is being converted to a Vue component
		// So, we're essentially gutting this constructor to get something easily working in the meantime
		this.instance = document.getElementById("geomap");
		this.$element = $(this.instance);
		this.markerIcons = {};

		this.defaultSettings = {
			height: '400',
			width: '100%'
		};

		// instantiation functions must be called last.
		this.initIcons();
		this.init();
	}

	/**
	 * Initializes the leaflet map instance.
	 * @return {null}
	 */
	init() {
		this.settings = JSON.parse(new Array(this.$element.attr('data-geomap-settings'))) || this.defaultSettings;
		this.markers = JSON.parse(new Array(this.$element.attr('data-geomap-markers'))) || [];
		// TODO Allow configuring center

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
			// NOTE We re-reference the DOM element here b/c there's something funky happening re: DOM manipulation, maybe
			// Vue-related, where stored element references don't work as the element param to the map constructor...not sure what's up
			let map = new google.maps.Map(document.getElementById("geomap"), {
				center: this.settings.center || {lat: 32.5, lng: -110.09},
				zoom: 8
			});

			// TODO Uncommented b/c figured map should be centered on user's home group primarily
			// TODO Consider setting center in constructor config to geoLocation if no supplied center i.e. home group
			// map.setCenter(geoLocation ? geoLocation : map.getCenter());

			// create an infoWindow
			let mapInfoWindow = new google.maps.InfoWindow();

			let marker, i;
			let mapLocations = this.markers;
			let self = this;
			const bounds = new google.maps.LatLngBounds();

			// loop through the markers and attach them to the map instance
			for (i = 0; i < mapLocations.length; i++) {
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(Number(mapLocations[i].lat), Number(mapLocations[i].lng)),
					icon : this.getIcon(mapLocations[i]),
					map: map
				});

				bounds.extend(marker.getPosition());

				google.maps.event.addListener(marker, 'click', (function(marker, i) {
					let markerContent = `
						${mapLocations[i].description} <br/>
						${self.getReadMore(mapLocations[i].readmore)}
					`;

					return function() {
						mapInfoWindow.setContent(markerContent);
						mapInfoWindow.open(map, marker);
					}
				})(marker, i));
			}

			// ensures map display contains all markers
			map.fitBounds(bounds);
		});

		this.$element.css({
			height: this.settings.height,
			width: this.settings.width
		});
	}

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
	}

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

	getReadMore(item) {
		let result;

		if (item !== undefined && item.text !== undefined && item.path !== undefined) {
			result = `<a href="${item.path}">${item.text}</a>`;
		} else {
			result = '';
		}

		return result;
	}

}

$('body').find('[data-geomap]:not([data-map-hidden])').each(function(idx, item) {
	new GeoMap(item);
});

$('body').on("click", 'a[href="#mygroups_map"]', function(){
	let map = $($(this).attr("href")).find("[data-geomap][data-map-hidden]");
	$('body').off("click", 'a[href="#mygroups_map"]');
	new GeoMap(map);
});
