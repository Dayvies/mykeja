#!/usr/bin/node
let marker = null;
$(document).ready(function () {
  window.initMap = initMap;
  let lat = $("#latitude").val();
  let lng = $("#longitude").val();
  if (isNaN(lat) && isNaN(lng)) {
    let latlng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    placeMarkerAndPanTo(latlng, map);
  }
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

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo("bounds", map);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");

  infowindow.setContent(infowindowContent);

  marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -37),
  });
  let lat = $("#latitude").val();
  let lng = $("#longitude").val();
  if (!isNaN(lat) && !isNaN(lng) && lat.length > 0 && lng.length > 0) {
    let latlng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    placeMarkerAndPanTo(latlng, map);
  }

  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    let loc = place.geometry.location.toJSON();
    $("#latitude").val(loc.lat);
    $("#longitude").val(loc.lng);

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent =
      place.formatted_address;
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.

  //  biasInputElement.addEventListener("change", () => {
  //           if (biasInputElement.checked) {
  //             autocomplete.bindTo("bounds", map);
  //           } else {
  //             // User wants to turn off location bias, so three things need to happen:
  //             // 1. Unbind from map
  //             // 2. Reset the bounds to whole world
  //             // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
  //             autocomplete.unbind("bounds");
  //             autocomplete.setBounds({
  //               east: 180,
  //               west: -180,
  //               north: 90,
  //               south: -90
  //             });
  //             strictBoundsInputElement.checked = biasInputElement.checked;
  //           }

  //           input.value = "";
  //         });
  //         strictBoundsInputElement.addEventListener("change", () => {
  //           autocomplete.setOptions({
  //             strictBounds: strictBoundsInputElement.checked,
  //           });
  //           if (strictBoundsInputElement.checked) {
  //             biasInputElement.checked = strictBoundsInputElement.checked;
  //             autocomplete.bindTo("bounds", map);
  //           }

  //           input.value = "";
  //         });
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
  $("#latitude").val(loc.lat);
  $("#longitude").val(loc.lng);
}
