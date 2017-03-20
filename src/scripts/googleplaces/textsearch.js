
  // const Assert = require('assert');


  const TextSearch = require('../node_modules/googleplaces/lib/TextSearch.js');
  const Config = require('./config.js');

  const FS = require('fs');
  const Readline = require('readline');

  const textSearch = new TextSearch(Config.apiKey, Config.outputFormat);

  const groupname = 'Tucson';
  const location = 'Tucson, Arizona';
  const parameters = {
      query: location
  };

  textSearch(parameters, (error, response) => {

      if (error) {
          throw error;
      }
      console.log(groupname + ' : ' + location);

      if (response.results.length === 0) {
          console.log('   0 results');
          return;
      }
      console.log(response.results[0].geometry.location);
  });


/*


  // read a list of groups
  const RL = Readline.createInterface({
      input:   FS.createReadStream('./US-W_Groups_locations.csv')
  });

  // for every line, split by comma and then search google places.
  RL.on('line', (line) => {

      const groupname = line.slice(0, line.indexOf(','));
      let location = line.slice(line.indexOf(',') + 1);
      location = location.replace(/"/g, '');   // get rid of extra quotes
      console.log(groupname + ' : ' + location);

      const parameters = {
          query: location
      };

      // limit how often we hit the google api...
      setTimeout( () => {

          textSearch(parameters, (error, response) => {

              if (error) {
                  throw error;
              }
              console.log(groupname + ' : ' + location);

              if (response.results.length === 0) {
                  console.log('   0 results');

                  return;
              }
              console.log(response.results[0].geometry.location);
          });
      }, 1000);


  });







*/
