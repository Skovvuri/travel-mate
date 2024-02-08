// take in a location

// search for near by places to vist

// google api key

// variables
let map;
let service;
let infowindow;


// initalise startLocation of map on load of page
function initMap() {
  console.log("initMap");
  const startLocation = new google.maps.LatLng(53.4810, -2.2374);

  // assign google-map element for intial map loading, and then load requests about location
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("google-map"), {
    center: startLocation,
    zoom: 15,
  });

  const request = {
    query: "Restaraunts",
    fields: ["name", "geometry"],
  };

  //intitalise map element with 
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