// take in a location

// search for near by places to vist

// google api key



//https://developers.google.com/maps/documentation/javascript/examples/map-simple?_gl=1*1jxxev7*_up*MQ..*_ga*MTQ5ODM4OTkxLjE3MDczOTI5NzY.*_ga_NRWSTWS78N*MTcwNzM5Mjk3NS4xLjAuMTcwNzM5MzAzMC4wLjAuMA..#maps_map_simple-javascript

// let map

// async function initMap() {
//     const { Map } = await google.maps.importLibrary("maps");
  
//     map = new Map(document.getElementById("img-location"), {
//       center: { lat: -34.397, lng: 150.644 },
//       zoom: 8,
//     });
//   }
  
//   initMap();


/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

function initMap() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);
  console.log(sydney);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("google-map"), {
    center: sydney,
    zoom: 15,
  });

  const request = {
    query: "Museum of Contemporary Art Australia",
    fields: ["name", "geometry"],
  };

  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

window.initMap = initMap;