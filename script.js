// Load Leaflet JS
const script = document.createElement("script");
script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
script.onload = initMap;
document.head.appendChild(script);

function initMap() {
  const defaultLat = 8.536591;
  const defaultLng = 76.883261;

  // Create map
  const map = L.map("address-map").setView([defaultLat, defaultLng], 16);

  // Add OSM tiles
 L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
  maxZoom: 20
}).addTo(map);




  // Function to update address text
  const updateAddress = (lat, lng) => {
    document.getElementById("coords").textContent =
      `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("address").textContent =
          "Selected Address: " + (data.display_name || "Unknown location");
      })
      .catch(() => {
        document.getElementById("address").textContent = "Error fetching address.";
      });
  };

  // Initial address
  updateAddress(defaultLat, defaultLng);

  // Update when map stops moving
  map.on("moveend", () => {
    const center = map.getCenter();
    updateAddress(center.lat, center.lng);
  });

  // Search box event
  const searchBox = document.getElementById("searchBox");
  const suggestionsDiv = document.getElementById("suggestions");

  let searchTimeout = null;

  searchBox.addEventListener("input", () => {
    const query = searchBox.value.trim();
    if (!query) {
      suggestionsDiv.style.display = "none";
      return;
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
        .then(res => res.json())
        .then(results => {
          suggestionsDiv.innerHTML = "";
          if (results.length === 0) {
            suggestionsDiv.style.display = "none";
            return;
          }

          results.forEach(place => {
            const item = document.createElement("div");
            item.textContent = place.display_name;
            item.addEventListener("click", () => {
              map.setView([parseFloat(place.lat), parseFloat(place.lon)], 16);
              searchBox.value = place.display_name;
              suggestionsDiv.style.display = "none";
            });
            suggestionsDiv.appendChild(item);
          });

          suggestionsDiv.style.display = "block";
        })
        .catch(() => {
          suggestionsDiv.style.display = "none";
        });
    }, 300); // debounce
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#suggestions") && e.target !== searchBox) {
      suggestionsDiv.style.display = "none";
    }
  });
}
