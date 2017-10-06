const countries = require('./countries');
const regions = require('./regions');

class FindGroups {
  constructor(map) {
    this.init();
  }
  
  attachListeners = () => {
    $(document).on('submit', '.find-groups-search .in-page-search form',  e => {
      e.preventDefault();
      e.stopPropagation();
      /*
        TODO: take in search term. If it's a country or state, then display a select2 with regions within. If it's a city, show matching groups within a 50 (?) mile radius
        
        $('.find-groups-select').show();
        $('.find-groups-select').select2({
          placeholder: 'Search by city, state or country...'
        });
      */
    });
  }
  
  init = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError);
    } else {
      alert('Sorry, location services are not available for your device. Please enter search parameters.');
    }
  }
  
  locationSuccess = (position) => {
    // populate the list and geomap with groups within 50 miles of the user location
    console.log(position.coords.latitude, position.coords.longitude);
  }

  locationError = (err) => {
    // if unable to get location, input will come from search box
    this.attachListeners();
    
    /*
    TODO: use Maps API to create a new map
     $('#find-groups_map').empty();
     $('#find-groups_map').append(re-rendered map goes here);
    */
  }
}

if (window.location.href.match('find-groups')) {
  document.addEventListener('DOMContentLoaded', ()=> {
    const findGroupMap = new FindGroups('#find-groups_map');
  });
}

export default "FINDGROUPS";