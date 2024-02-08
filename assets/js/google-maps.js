// take in a location

// search for near by places to vist

// google api key



//https://developers.google.com/maps/documentation/javascript/examples/map-simple?_gl=1*1jxxev7*_up*MQ..*_ga*MTQ5ODM4OTkxLjE3MDczOTI5NzY.*_ga_NRWSTWS78N*MTcwNzM5Mjk3NS4xLjAuMTcwNzM5MzAzMC4wLjAuMA..#maps_map_simple-javascript

let map
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
  
    map = new Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }
  
  initMap();