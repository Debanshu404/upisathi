import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, Popup } from "react-leaflet";
import { ArrowUpRight, Banknote, Smartphone } from "lucide-react";
import L from "leaflet";

// User Icon (Pulsing blue dot)
const userIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
    <div class="absolute w-5 h-5 bg-indigo-500 rounded-full animate-ping opacity-60"></div>
    <div class="relative w-3.5 h-3.5 bg-indigo-600 border-2 border-white rounded-full shadow-md"></div>
  </div>`,
  className: "custom-user-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Custom Icon for Nearby Request Markers showing user initials / coloring based on request type
const createRequestIcon = (request) => {
  const isCash = request.type === 'NEED_CASH';
  const colorClass = isCash ? 'border-emerald-500' : 'border-indigo-650';
  const tipColorClass = isCash ? 'border-t-emerald-500' : 'border-t-indigo-650';
  const ringBgClass = isCash ? 'bg-emerald-500/20' : 'bg-indigo-500/20';
  
  const avatar = request.creator?.avatar;
  const username = request.creator?.username || '?';
  const firstLetter = username.charAt(0).toUpperCase();

  const htmlContent = `
    <div class="relative flex flex-col items-center">
      <div class="absolute -top-1 w-11 h-11 ${ringBgClass} rounded-full animate-ping opacity-60"></div>
      <div class="relative w-9 h-9 rounded-full border-2 ${colorClass} bg-white shadow-md flex items-center justify-center overflow-hidden z-10">
        ${avatar 
          ? `<img src="${avatar}" class="w-full h-full object-cover" />` 
          : `<div class="w-full h-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">${firstLetter}</div>`
        }
      </div>
      <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${tipColorClass} -mt-0.5 z-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"></div>
    </div>
  `;

  return L.divIcon({
    html: htmlContent,
    className: `custom-req-pointer-${request._id}`,
    iconSize: [36, 42],
    iconAnchor: [18, 42]
  });
};

function MapBoundsUpdater({ userCoords, requests }) {
  const map = useMap();

  useEffect(() => {
    if (userCoords) {
      const bounds = [userCoords];
      requests.forEach(req => {
        if (req.location?.coordinates) {
          bounds.push([req.location.coordinates[1], req.location.coordinates[0]]);
        }
      });
      
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
      } else {
        map.setView(userCoords, 13);
      }
    }
  }, [map, userCoords, requests]);

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [map]);

  return null;
}

export default function NearbySwapsMap({ userLocation, requests, onSelectRequest }) {
  if (!userLocation) return null;

  const userCoords = [userLocation.latitude, userLocation.longitude];

  return (
    <div className="w-full relative overflow-hidden rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] z-0">
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

        {/* Request Markers */}
        {requests.map((req) => {
          if (!req.location?.coordinates) return null;
          const reqCoords = [req.location.coordinates[1], req.location.coordinates[0]];
          const isCash = req.type === 'NEED_CASH';
          
          return (
            <Marker key={req._id} position={reqCoords} icon={createRequestIcon(req)}>
              <Popup>
                <div className="min-w-[180px] text-slate-800 p-0.5">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 flex-shrink-0">
                      {req.creator?.avatar ? (
                        <img src={req.creator.avatar} alt={`${req.creator?.username || 'User'} avatar`} className="w-full h-full object-cover" />
                      ) : (
                        req.creator?.username?.charAt(0).toUpperCase() || '?'
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs leading-tight truncate">
                        {req.creator?.username || 'Nearby user'}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-bold">Active request</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-2.5">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 font-black block">Amount</span>
                      <span className="text-sm font-black text-slate-900 block mt-0.5">₹{req.amount}</span>
                    </div>
                    <div className={`border rounded-xl p-2 ${isCash ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'}`}>
                      <span className={`text-[8px] uppercase tracking-wider font-black block ${isCash ? 'text-emerald-500' : 'text-indigo-500'}`}>Needs</span>
                      <span className={`flex items-center gap-1 text-[10px] font-black mt-1 ${isCash ? 'text-emerald-700' : 'text-indigo-700'}`}>
                        {isCash ? <Banknote size={11} /> : <Smartphone size={11} />}
                        {isCash ? 'Cash' : 'UPI'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectRequest(req)}
                    className="w-full h-9 !bg-indigo-600 hover:!bg-violet-600 !text-white font-extrabold text-[10px] rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-violet-600/25 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer border-0"
                  >
                    <span>View & Select Swap</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapBoundsUpdater userCoords={userCoords} requests={requests} />
      </MapContainer>
    </div>
  );
}
