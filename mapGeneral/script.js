// Load Leaflet JS
const leafletScript = document.createElement("script");
leafletScript.src = "https://unpkg.com/leaflet/dist/leaflet.js";
document.head.appendChild(leafletScript);
const routeColor = '#ffffff';
const iconSize = [20,20];
const iconAnchor = [iconSize[0]/2, iconSize[0]/2]

// Load Routing Machine JS after Leaflet
leafletScript.onload = () => {
  const routingScript = document.createElement("script");
  routingScript.src = "https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js";
  routingScript.onload = initMap;
  document.head.appendChild(routingScript);
};

function initMap() {
  // Fixed coordinates for demo (Delhi-ish)
  const driverLocation     = [8.5592027, 76.8760656];
  const restaurantLocation = [8.5635877, 76.8757079];
  const userLocation       = [8.550877, 76.883125];
  // Create map
  const map = L.map("map", { attributionControl: false, zoomControl: false   }).setView(driverLocation, 15);

  // Dark basemap
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20
  }).addTo(map);

  // Icons
  const driverIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    iconSize: iconSize,
    iconAnchor: iconAnchor
  });

  const restaurantIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    iconSize: iconSize,
    iconAnchor: iconAnchor
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
    iconSize: iconSize,
    iconAnchor: iconAnchor
  });

  // Markers
  const driverMarker = L.marker(driverLocation, { icon: driverIcon }).addTo(map);
  const restaurantMarker = L.marker(restaurantLocation, { icon: restaurantIcon }).addTo(map);
  const userMarker = L.marker(userLocation, { icon: userIcon }).addTo(map);

  // Fit map to all markers
  const group = L.featureGroup([driverMarker, restaurantMarker, userMarker]);
  map.fitBounds(group.getBounds(), { padding: [20, 20]  });

  // Route (Driver -> Restaurant -> User)
  L.Routing.control({
    waypoints: [
      L.latLng(driverLocation),
      L.latLng(restaurantLocation),
      L.latLng(userLocation)
    ],
    routeWhileDragging: false,
    showAlternatives: false,
    addWaypoints: false,
    draggableWaypoints: false,
    lineOptions: {
      styles: [{ color: routeColor, opacity: 0.9, weight: 1 }]
    },
    createMarker: () => null // Don't add default markers
  }).addTo(map);
}
