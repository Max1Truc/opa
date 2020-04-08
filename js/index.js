// Map creation

map = L.map('map').fitWorld();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c']
}).addTo(map);

map.locate({
  setView: false,
  maxZoom: 16,
  watch: true
});

// Geolocation

zoomed = false;
marker = false;
circle = false;

function onLocationFound(e) {
  var radius = e.accuracy;

  if (!zoomed) {
    map.setView(e.latlng, radius);
    zoomed = true;
  }

  if (marker) {
    marker.setLatLng(e.latlng)
  } else {
    marker = L.marker(e.latlng);
    marker.addTo(map);
  }

  if (circle) {
    circle.setLatLng(e.latlng);
    circle.setRadius(radius);
  } else {
    circle = L.circle(e.latlng, radius);
    circle.addTo(map);
  }
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Address location

var addressCircle = false;

function onAddressFound(address_data) {
  var latlng = [address_data[0].lat, address_data[0].lon];

  if (addressCircle) {
    addressCircle.setLatLng(latlng);
  } else {
    addressCircle = L.circle(latlng, {radius: 1000, color: "red"});
    addressCircle.addTo(map);
  }
}

function addr_search() {
  var address = prompt("Merci d'entrer votre addresse")
  var xmlhttp = new XMLHttpRequest();
  var url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(address);
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myArr = JSON.parse(this.responseText);
      onAddressFound(myArr);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

document.getElementById("addressbutton").addEventListener("click", addr_search)
