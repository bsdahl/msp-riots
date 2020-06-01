const fs = require('fs');

require('dotenv').config();
const GoogleMaps = require('@google/maps');
const GOOGLE_MAPS_API_KEY = process.env['REACT_APP_MAPS_KEY'];

const businesses = require('../src/businesses.json');

async function main() {
  let results = [];

  await Promise.all(
    businesses.map(async (location) => {
      const test = await parseUsingGoogleMaps(location[0]);

      results.push({
        query: location[0],
        description: location[1],
        place: test,
      });
    })
  );

  let data = JSON.stringify(results);
  fs.writeFileSync('./src/places.json', data);
}

main();

async function parseUsingGoogleMaps(inputString) {
  // Add the addresses.
  let googleMapsClient = GoogleMaps.createClient({
    key: GOOGLE_MAPS_API_KEY,
    Promise: Promise,
  });

  let place = googleMapsClient
    .findPlace({
      input: inputString,
      inputtype: 'textquery',
      locationbias: 'point:44.9778,-93.265',
    })
    .asPromise();
  try {
    place = await place;
  } catch (error) {
    console.error(`Error: failed to find place ${inputString}`);
    return {};
  }

  if (place.json.status !== 'OK') {
    if (place.json.status !== 'ZERO_RESULTS') {
      console.error(`Error: place status is ${place.json.status} ${inputString}`);
    }
    return {};
  }

  // Pull the first item from the list if there is one.
  place = place.json.candidates.reduce((acc) => acc);
  if (place === undefined) {
    return {};
  }

  let address = await googleMapsClient.place({ placeid: place.place_id }).asPromise();
  if (address.json.status !== 'OK') {
    console.error(`Error: address status is ${place.json.status} ${inputString}`);
    return {};
  }

  return address.json;
}
