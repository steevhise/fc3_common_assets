/// this looks up coordinates for local groups.

  // const Assert = require('assert');

const Hapi = require('hapi');
const Hoek = require('hoek');

// import all our classes
import { groupClassFunc } from '../../../node_modules/@freecycle/common-hapi-plugins/lib/freecycle-group.js';

import { Context } from '../../../node_modules/@freecycle/freecycle_node_dal';
import { graphql } from '../../../node_modules/graphql';
import schema from '../../../node_modules/@freecycle/freecycle_graphql_schema';


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

const done = 0;

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

let numlines = 0;
let queries = 0;


const data = FS.readFileSync('./US-W_Groups_locations.csv', 'utf8');
const lines = data.split('\n');

// every so often, process a line
const intervalId = setInterval(() => {

    const line = lines.shift();
    console.error('-------------------');
    console.error(line);

    // if no more lines
    if (!line) {
        clearInterval(intervalId);   // stop the loop...
        // if we're done with the whole file, then we're done.
        if (queries === numlines) {
            Context.close();   // disconnect from database? Not doing this is what causes the hang at the end.
            console.error('we are done.');
            return;
        }
    }

    numlines++;
    const groupname = line.slice(0, line.indexOf(','));
    let location = line.slice(line.indexOf(',') + 1);
    location = location.replace(/"/g, '');   // get rid of extra quotes
    //console.log(groupname + ' : ' + location);

    const parameters = {
        query: location
    };

    // TODO: generalize this function so we can swap in other apis when we want to use others besides Google.
    textSearch(parameters, (error, response) => {

        if (error) {
            throw error;
        }
        console.error('looking for ' + groupname + ' : ' + location);

        if (response.results.length === 0) {
            console.error('   0 results');
            throw (response.error_message);     // we've probably exceeded our API quota, so bail.
        }

        // now look up the group and save the new coordinates
        let group;
        let id;
        return new Group(groupname, (err, result) => {

            Hoek.assert(!err, err);
            if (result === null) {
                console.error('couldnt find ' + groupname);
                id = '?';
            }
            else {
                group = result;
                group.latitude = response.results[0].geometry.location.lat;
                group.longitude = response.results[0].geometry.location.lng;
                id = group.group_id;
            }

            // console.log(group);
            // now either way we have something to output even if we didn't find a group id.
            console.log(Util.format('%d,%s,%s,%s', id, groupname, response.results[0].geometry.location.lat, response.results[0].geometry.location.lng));
            console.error('group id: ' + id);
                // group.save(); TODO

            queries++;

        });
    });

}, 2000);




