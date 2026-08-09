import React, { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

// Custom DivIcon for the User (Pulsing blue dot)
const userIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
    <div class="absolute w-5 h-5 bg-indigo-500 rounded-full animate-ping opacity-60"></div>
    <div class="relative w-3.5 h-3.5 bg-indigo-600 border-2 border-white rounded-full shadow-md"></div>
  </div>`,
  className: "custom-user-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Custom DivIcon for the Request location (Pulsing rose map pin)
const requestIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
    <div class="absolute w-7 h-7 bg-rose-500/10 rounded-full animate-pulse"></div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-rose-500 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
      <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
    </svg>
  </div>`,
  className: "custom-request-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// Sub-component to fit map bounds to show both user and request markers
function MapBoundsUpdater({ userCoords, reqCoords }) {
  const map = useMap();

  useEffect(() => {
    if (userCoords && reqCoords) {
      const bounds = [userCoords, reqCoords];
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, userCoords, reqCoords]);

  return null;
}

function LocationMap({ userLocation, requestLocation }) {
  if (!userLocation || !requestLocation) return null;

  const userCoords = [userLocation.latitude, userLocation.longitude];
  const reqCoords = [requestLocation[1], requestLocation[0]]; // GeoJSON is [lng, lat]

  return (
    <div className="w-full relative overflow-hidden rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <MapContainer
        center={userCoords}
        zoom={13}
        maxZoom={18}
        style={{
          height: "220px",
          width: "100%",
          zIndex: 0,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Marker */}
        <Marker position={userCoords} icon={userIcon} />

        {/* Request Marker */}
        <Marker position={reqCoords} icon={requestIcon} />

        {/* Dynamic bounds fit */}
        <MapBoundsUpdater userCoords={userCoords} reqCoords={reqCoords} />
      </MapContainer>
    </div>
  );
}

export default LocationMap;
