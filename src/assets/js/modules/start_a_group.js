const regions = require('./regions.js');

document.addEventListener("DOMContentLoaded", ()=> {
    $('.start-group .country-dropdown').select2({
      placeholder: 'Select a country...'
    });
    
    $('.start-group .country-dropdown').on('select2:select', function (e) {
      const {id} = e.params.data;    
      const localRegions = regions[id];

      $('.start-group .region-dropdown').select2();
      
      localRegions.forEach(item => {
        $('.start-group .region-dropdown').append(`<option value="${item.shortCode}">${item.name}</option>`);
      });
    });
});
