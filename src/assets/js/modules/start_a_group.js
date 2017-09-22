const regions = require('./regions.js');

document.addEventListener("DOMContentLoaded", ()=> {
    $('.start-group .country-dropdown').select2({
      placeholder: 'Select a country...'
    });
    
    $('.start-group .country-dropdown').on('select2:select', function (e) {
      const {id} = e.params.data;    
      const localRegions = regions[id];
      
      // init the region dropdown
      $('.start-group .region-dropdown').select2();
      // empty incase another country was clicked in error 
      $('.start-group .region-dropdown').empty();
      
      localRegions.forEach(item => {
        $('.start-group .region-dropdown').append(`<option value="${item.shortCode}">${item.name}</option>`);
      });
    });
});
