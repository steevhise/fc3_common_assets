export class FindGroups {
  constructor(map) {
    this.location();
  }
  
  attachListeners = () => {
    // placeholder for search listener
  }
  
  location = () => {
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
    
    const mapDiv = document.getElementById('find-groups_map');
    const geocoder = new google.maps.Geocoder();
    const address = "Phoenix, Arizona";
    let map,
        matchingLocations;
        
    geocoder.geocode({ address }, (results, status) => {
      map = new google.maps.Map(mapDiv, {
        center: results[0].geometry.location,
        zoom: 8,
      });
    });
    /*
    <div
      id="geomap"
      data-geomap
      data-geomap-markers=`${matchingLocations}`
      data-geomap-settings='{"height":"400","width":"100%"}'>
    </div>
    
    { 'lat' : 32.5, 'lng' : -110.09, 'description' : 'Tucson', 'icon' : 'group' }
    */ 
    $('#find-groups_map').empty();
    $('#find-groups_map').append(/*map goes here*/);
  }
}

if (window.location.href.match('find-groups')) {
  document.addEventListener('DOMContentLoaded', ()=> {
    const findGroupMap = new FindGroups('#find-groups_map');
  });
}