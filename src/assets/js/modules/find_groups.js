export class FindGroups {
  constructor() {
    this.location();
  }
  
  location = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(this.locationRetrieved, this.locationError);
    } else {
      alert('Sorry, location services are not available for your device. Please enter search parameters.');
    }
  }
  
  locationRetrieved = (position) => {
    // populate the list and geomap with groups within 50 miles of the user location
    console.log(position.coords.latitude, position.coords.longitude);
  }

  locationError = (err) => {
    // if unable to get location, input will come from search box
    console.log('sorry, there was an error: ', err);
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  const findGroupMap = new FindGroups('#find-groups_map');
});