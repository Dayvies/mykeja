#!/usr/bin/node
let marker = null;
$(document).ready(function () {
  window.initMap = initMap;

 
});

function initMap() {
  console.log("setting map");
  const map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: -1.2920659,
      lng: 36.8219462,
    },
    zoom: 13,
    mapTypeControl: false,
  });
  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input");
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
    types: [],
  };
  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });

 

  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");

  infowindow.setContent(infowindowContent);

  marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -37),
  });
  let lat = $(".image").data("latitude");
  let lng = $(".image").data("longitude");
  console.log(lat.length);
  if (!isNaN(lat) && !isNaN(lng) && String(lat).length > 0 && String(lng).length > 0) {
    console.log(lat,lng);
    let latlng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    placeMarkerAndPanTo(latlng, map);
  }
  else{
        console.log("Location not valid or set");
  }

}

function placeMarkerAndPanTo(latLng, map) {
  if (marker !== null || marker !== undefined) {
    marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.setZoom(15);
  map.panTo(latLng);

  let loc = marker.getPosition().toJSON();
}
