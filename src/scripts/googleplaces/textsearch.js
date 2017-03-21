/// this looks up coordinates for local groups.

  // const Assert = require('assert');

const Hapi = require('hapi');
const Hoek = require('hoek');

// import all our classes
import { groupClassFunc } from '../../../node_modules/@freecycle/common-hapi-plugins/lib/freecycle-group.js';

import { Context } from '@freecycle/freecycle_node_dal';
import { graphql } from '@freecycle/freecycle_node_dal';

const server = new Hapi.Server();

server.decorate('server', 'context', Context);   // access via server.context
server.decorate('server', 'graphql', graphql);   // access via server.graphql
server.decorate('server', 'schema', schema);      // access via server.schema

const Group = groupClassFunc(server);

const TextSearch = require('../../../node_modules/googleplaces/lib/TextSearch.js');
const Config = require('./config.js');

const FS = require('fs');
const Readline = require('readline');

const Util = require('util');

const textSearch = new TextSearch(Config.apiKey, Config.outputFormat);
/*

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

*/



  // read a list of groups
const RL = Readline.createInterface({
    input:   FS.createReadStream('./US-W_Groups_locations.csv')
});

  // for every line, split by comma and then search google places.
RL.on('line', (line) => {

    const groupname = line.slice(0, line.indexOf(','));
    let location = line.slice(line.indexOf(',') + 1);
    location = location.replace(/"/g, '');   // get rid of extra quotes
      // console.log(groupname + ' : ' + location);

    const parameters = {
        query: location
    };

      // limit how often we hit the google api...
    setTimeout( () => {

        textSearch(parameters, (error, response) => {

            if (error) {
                throw error;
            }
              // console.log(groupname + ' : ' + location);

            if (response.results.length === 0) {
                console.error('   0 results');
                return;
            }
            console.log(Util.format('%s,%s,%s', groupname, response.results[0].geometry.location.lat, response.results[0].geometry.location.lng));

              // now look up the group and assign the new coordinates
            let group;
            return new Group(groupname, (err, result) => {

                Hoek.assert(!err, err);
                group = result;
                group.latitude = response.results[0].geometry.location.lat;
                group.longitude = response.results[0].geometry.location.lng;
                console.log(group);
                  // group.save(); TODO

            });
        });
    }, 1000);

});


