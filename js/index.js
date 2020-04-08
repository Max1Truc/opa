// Register service worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js', { scope: '/' }).then(function(reg) {

    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

// Map creation

map = L.map('map').fitWorld();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c']
}).addTo(map);

// Geolocation

zoomed = false;
marker = false;
circle = false;

function onLocationFound(geolocation) {
  var radius = geolocation.coords.accuracy,
      lat = geolocation.coords.latitude,
      lng = geolocation.coords.longitude,
      latlng = [lat, lng];

  if (!zoomed) {
    map.setView(latlng, radius);
    zoomed = true;
  }

  if (marker) {
    marker.setLatLng(latlng)
  } else {
    marker = L.marker(latlng);
    marker.addTo(map);
  }

  if (circle) {
    circle.setLatLng(latlng);
    circle.setRadius(radius);
  } else {
    circle = L.circle(latlng, radius);
    circle.addTo(map);
  }
}

function getPosition() {
  return navigator.geolocation.getCurrentPosition(onLocationFound);
}

setInterval(getPosition, 2000);
getPosition();

// Address location

var addressCircle = false;

function onAddressFound(latlng) {
  if (addressCircle) {
    addressCircle.setLatLng(latlng);
  } else {
    addressCircle = L.circle(latlng, {
      radius: 1000,
      color: "green"
    });
    addressCircle.addTo(map);
  }

  localStorage.setItem("addressLatLng", JSON.stringify(latlng))
}

function addr_search() {
  var address = prompt("Merci d'entrer votre addresse")

  if (address) {
    var xmlhttp = new XMLHttpRequest();
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(address);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        onAddressFound([ myArr[0].lat, myArr[0].lon ]);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
}

function initialize_address() {
  var latlng = localStorage.getItem("addressLatLng");
  if (latlng) {
    onAddressFound(JSON.parse(latlng));
  }
}

initialize_address();

document.getElementById("addressbutton").addEventListener("click", addr_search)
