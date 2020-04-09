function measure(lat1, lon1, lat2, lon2) {
  // https://stackoverflow.com/a/11172685/9438168
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
}

var container = document.getElementById("homedistance");

function updateDistance(homeLatLng) {
  navigator.geolocation.getCurrentPosition((geolocation) => {
    var distance = Math.round(
      measure(homeLatLng[0], homeLatLng[1], geolocation.coords.latitude, geolocation.coords.longitude)
    );
    container.innerText = "Selon la dernière addresse que vous avez entrée, vous êtes à environ " + distance + " mètres de votre lieu d'habitation.";
  })
}

var address = localStorage.getItem("addressLatLng");

if (address) {
  try {
    var latlng = JSON.parse(address);

    setInterval(() => {
      updateDistance(latlng);
    }, 2000)
    updateDistance(latlng);
  } catch (e) {
    console.error("Error parsing addressLatLng from LocalStorage: " + e);
  }
}
