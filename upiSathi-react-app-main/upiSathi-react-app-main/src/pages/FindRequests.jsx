import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin, CheckCircle2, Star } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePublicRequests } from '../hooks/useExchanges';
import { useAcceptRequest } from '../hooks/useMatches';
import { socketContext } from '../context/SocketContext';
import { locationContext } from '../context/LocationContext';
import { calculateDistance } from '../utils/geo';
import LocationMap from '../components/LocationMap';
import { MapContainer, Marker, TileLayer, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

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

// Helper function to create custom Leaflet DivIcons showing the user's avatar
const createRequestIcon = (request) => {
  const isCash = request.type === 'NEED_CASH';
  const colorClass = isCash ? 'border-emerald-500' : 'border-indigo-600';
  const tipColorClass = isCash ? 'border-t-emerald-500' : 'border-t-indigo-600';
  const ringBgClass = isCash ? 'bg-emerald-500/20' : 'bg-indigo-500/20';
  
  const avatar = request.creator?.avatar;
  const username = request.creator?.username || '?';
  const firstLetter = username.charAt(0).toUpperCase();

  const htmlContent = `
    <div class="relative flex flex-col items-center">
      <!-- Pulsing outer ring -->
      <div class="absolute -top-1 w-11 h-11 ${ringBgClass} rounded-full animate-ping opacity-60"></div>
      
      <!-- Avatar Circle Frame -->
      <div class="relative w-9 h-9 rounded-full border-2 ${colorClass} bg-white shadow-md flex items-center justify-center overflow-hidden z-10">
        ${avatar 
          ? `<img src="${avatar}" class="w-full h-full object-cover" />` 
          : `<div class="w-full h-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">${firstLetter}</div>`
        }
      </div>
      <!-- Pin tip -->
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

// Sub-component to fit map bounds to show both user and all requests
function RequestsMapBoundsUpdater({ userLocation, requests }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      const bounds = [[userLocation.latitude, userLocation.longitude]];
      requests.forEach(req => {
        if (req.location?.coordinates) {
          bounds.push([req.location.coordinates[1], req.location.coordinates[0]]);
        }
      });
      
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else {
        map.setView([userLocation.latitude, userLocation.longitude], 14);
      }
    }
  }, [map, userLocation, requests]);

  // Invalidate map size on tab change to prevent grey rendering bug
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [map]);

  return null;
}

const PublicRequestCard = ({ request, onAccept, currentLocation }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    await onAccept(request._id);
    setIsAccepting(false);
  };

  const diffMins = Math.max(0, Math.round((new Date(request.expiresAt) - new Date()) / 60000));
  const totalDuration = new Date(request.expiresAt) - new Date(request.createdAt);
  const elapsed = new Date() - new Date(request.createdAt);
  const remainingPct = totalDuration > 0 ? Math.max(0, Math.min(100, ((totalDuration - elapsed) / totalDuration) * 100)) : 0;
  
  const barColor = remainingPct > 50 
    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
    : remainingPct > 20 
      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' 
      : 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]';

  const distance = currentLocation && request.location?.coordinates
    ? calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        request.location.coordinates[1], // latitude
        request.location.coordinates[0]  // longitude
      ).toFixed(1)
    : null;

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 mb-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)] hover:border-indigo-100 hover:shadow-[0_12px_35px_rgba(99,102,241,0.05)] hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <Link to={`/profile/${request.creator?._id}`} className="flex items-center space-x-3.5 hover:opacity-85 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60 shadow-sm flex-shrink-0 flex items-center justify-center">
            {request.creator?.avatar ? (
              <img src={request.creator.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 font-bold text-base">
                {request.creator?.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">{request.creator?.username || 'Unknown User'}</h3>
              {request.creator?.trustScore !== undefined && (
                <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-700 font-extrabold bg-amber-50 border border-amber-100 rounded-full px-1.5 py-0.5 shadow-sm shadow-amber-100/10">
                  <Star size={9} className="fill-amber-400 text-amber-400" />
                  {Number(request.creator.trustScore).toFixed(1)}
                </span>
              )}
            </div>
            <div className="flex items-center text-[10px] text-slate-450 font-semibold mt-1">
              <span className="flex items-center text-slate-500">
                <MapPin size={11} className="mr-0.5 text-indigo-500" />
                {distance ? `${distance} km away` : 'Nearby'}
              </span>
              {request.creator?.totalReviews > 0 && (
                <>
                  <span className="mx-1.5 text-slate-300 font-light">•</span>
                  <span className="text-slate-400 font-medium">{request.creator.totalReviews} review{request.creator.totalReviews !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
        </Link>
        <span className="font-black text-xl text-indigo-600 tracking-tight">₹{request.amount}</span>
      </div>

      <div className="mb-4">
        {request.type === 'NEED_CASH' ? (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-lg text-[9px] font-extrabold uppercase tracking-wider mb-3 select-none">
            <span className="font-semibold text-slate-400 lowercase">pays</span>
            <span className="font-black">UPI</span>
            <span className="text-emerald-400 font-black">➔</span>
            <span className="font-semibold text-slate-400 lowercase">needs</span>
            <span className="font-black">Cash</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-750 border border-indigo-100/50 rounded-lg text-[9px] font-extrabold uppercase tracking-wider mb-3 select-none">
            <span className="font-semibold text-slate-400 lowercase">pays</span>
            <span className="font-black">Cash</span>
            <span className="text-indigo-400 font-black">➔</span>
            <span className="font-semibold text-slate-400 lowercase">needs</span>
            <span className="font-black">UPI</span>
          </div>
        )}
        
        {request.note && (
          <p className="text-xs text-slate-600 bg-slate-50/50 border border-slate-100/65 p-3.5 rounded-2xl font-semibold leading-relaxed mb-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
            {request.note}
          </p>
        )}

        {/* Toggle Map Button */}
        {currentLocation && request.location?.coordinates && (
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center space-x-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-xl border transition-all duration-200 active:scale-95 mb-3 cursor-pointer ${
              showMap 
                ? 'text-indigo-600 bg-indigo-50 border-indigo-100 shadow-sm shadow-indigo-100/5' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border-transparent hover:border-slate-200/30'
            }`}
          >
            <MapPin size={11} className={showMap ? 'text-indigo-500' : 'text-slate-400'} />
            <span>{showMap ? "Hide map spot" : "Show map spot"}</span>
          </button>
        )}

        {/* Map Container */}
        {showMap && (
          <div className="mt-1 mb-3 rounded-2xl overflow-hidden border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] animate-in fade-in zoom-in-97 duration-200 z-10 relative">
            <LocationMap userLocation={currentLocation} requestLocation={request.location.coordinates} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex-1 mr-5 space-y-1">
          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Closing in</span>
            <span className={remainingPct <= 20 ? 'text-rose-500 font-extrabold animate-pulse' : 'text-slate-500'}>
              {diffMins} min{diffMins !== 1 ? 's' : ''} left
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
            <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${remainingPct}%` }}></div>
          </div>
        </div>
        
        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-650 hover:to-indigo-600 text-white rounded-2xl font-black text-xs shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 flex-shrink-0 cursor-pointer"
        >
          {isAccepting ? <Loader2 className="animate-spin" size={14} /> : 'I can help'}
        </button>
      </div>
    </div>
  );
};

function FindRequests() {
  const navigate = useNavigate();
  const { socket, isOnline } = useContext(socketContext);
  const { currentLocation } = useContext(locationContext);
  const queryClient = useQueryClient();
  
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5); // radius in km
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'map'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAcceptingFromMap, setIsAcceptingFromMap] = useState(false);

  const renderRadiusSlider = (classes) => (
    <div className={`bg-white border border-slate-100/80 p-4 md:p-5 rounded-[2rem] space-y-3 md:space-y-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)] animate-in fade-in duration-300 ${classes}`}>
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Distance</span>
          <p className="text-xs text-slate-450 font-semibold hidden sm:block">Find swaps within your range</p>
        </div>
        <span className="font-extrabold text-sm text-indigo-650 bg-indigo-50/80 px-3 py-1 rounded-xl border border-indigo-100/30 shadow-sm shadow-indigo-100/5 select-none">
          {searchRadius} km
        </span>
      </div>
      <div className="relative pt-1">
        <input 
          type="range" 
          min="1" 
          max="10" 
          step="1"
          value={searchRadius}
          onChange={(e) => setSearchRadius(parseInt(e.target.value))}
          className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 px-0.5">
          <span>1 km</span>
          <span>5 km</span>
          <span>10 km</span>
        </div>
      </div>
    </div>
  );

  // Query
  const { data: rawRequests, isLoading } = usePublicRequests(
    currentLocation?.longitude,
    currentLocation?.latitude,
    searchRadius,
    {
      enabled: !!currentLocation,
    }
  );

  const requests = Array.isArray(rawRequests?.data) 
    ? rawRequests.data 
    : (Array.isArray(rawRequests) ? rawRequests : []);

  // Mutation
  const acceptRequestMutation = useAcceptRequest();

  // Socket updates
  useEffect(() => {
    if (!socket?.current || !currentLocation) return;

    const handleNewRequest = (data) => {
      console.log("FindRequests Socket: newRequest received", data);
      const request = data?.request;
      if (request) {
        // Invalidate public requests unconditionally so the list and map update in real-time
        queryClient.invalidateQueries({ queryKey: ['publicRequests'] });
      }
    };

    const handleRequestCancelled = (data) => {
      console.log("FindRequests Socket: requestCancelled received", data);
      const cancelledId = data?.requestId;
      if (cancelledId) {
        queryClient.invalidateQueries({ queryKey: ['publicRequests'] });
      }
    };

    socket.current.on('newRequest', handleNewRequest);
    socket.current.on('requestCancelled', handleRequestCancelled);

    return () => {
      if (socket.current) {
        socket.current.off('newRequest', handleNewRequest);
        socket.current.off('requestCancelled', handleRequestCancelled);
      }
    };
  }, [socket, currentLocation, searchRadius, queryClient, isOnline]);

  const handleAcceptRequest = async (requestId) => {
    try {
      setError(null);
      await acceptRequestMutation.mutateAsync(requestId);
      setSuccessMsg('Your offer was sent successfully! You can track this swap on your home dashboard.');
    } catch (err) {
      setError(err.message || 'Failed to accept request');
      throw err;
    }
  };

  return (
    <div className="flex flex-col h-full md:h-[calc(100vh-128px)] max-w-md md:max-w-7xl mx-auto pt-4 md:pt-0 pb-20 md:pb-0 relative px-3 md:px-8 md:overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5 px-3 md:px-0">
        <div className="flex items-center space-x-3.5 animate-in slide-in-from-left duration-300">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 hover:text-indigo-650 rounded-xl transition-all duration-200 active:scale-90 border border-transparent hover:border-slate-200/40 bg-white shadow-sm flex items-center justify-center text-slate-700"
            title="Go back"
          >
            <ArrowLeft size={20} className="stroke-[2.2]" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Help Someone Nearby</h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5">Fulfill cash or digital money requests around you</p>
          </div>
        </div>
      </div>

      {/* Radius Slider Filter (Mobile only) */}
      {renderRadiusSlider("mx-4 mb-6 md:hidden")}

      {/* View Switcher Tabs (mobile only) */}
      <div className="mx-4 mb-5 flex p-1 bg-slate-100/80 border border-slate-200/40 rounded-2xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] backdrop-blur-md flex-shrink-0 md:hidden">
        <button
          onClick={() => {
            setActiveTab('list');
            setSelectedRequest(null);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-300 active:scale-98 cursor-pointer ${
            activeTab === 'list'
              ? 'bg-white text-indigo-600 shadow-[0_2px_8px_rgba(99,102,241,0.06)] border border-slate-200/30'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          }`}
        >
          List View ({requests.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('map');
            setSelectedRequest(null);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-300 active:scale-98 cursor-pointer ${
            activeTab === 'map'
              ? 'bg-white text-indigo-600 shadow-[0_2px_8px_rgba(99,102,241,0.06)] border border-slate-200/30'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          }`}
        >
          Map View
        </button>
      </div>

      {successMsg && (
        <div className="mx-4 md:mx-0 mb-6 p-5 bg-emerald-50/80 border border-emerald-100 rounded-[2rem] flex flex-col items-center text-center space-y-3.5 shadow-[0_8px_30px_rgba(16,185,129,0.03)] animate-in fade-in slide-in-from-top-2 duration-300 relative flex-shrink-0">
          <button 
            onClick={() => setSuccessMsg(null)}
            className="absolute top-3 right-3 p-1.5 text-emerald-600 hover:bg-emerald-100/50 rounded-full transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <span className="text-xs font-black">✕</span>
          </button>
          <div className="w-11 h-11 rounded-full bg-emerald-100/60 border border-emerald-200/50 flex items-center justify-center text-emerald-600 shadow-sm">
            <CheckCircle2 size={22} className="stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-emerald-800 text-sm tracking-tight">Offer Sent!</h4>
            <p className="text-[11px] text-emerald-700 font-semibold max-w-[280px] leading-relaxed">
              {successMsg}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            Go to Home Screen
          </button>
        </div>
      )}

      {error && (
        <div className="px-4 md:px-0 mb-4 flex-shrink-0">
          <div className="p-3.5 bg-rose-50/80 text-rose-600 rounded-2xl text-xs font-bold border border-rose-100/40">
            {error}
          </div>
        </div>
      )}

      {/* Main Content Grid: Side-by-side on desktop, Switchable on mobile */}
      <div className="md:grid md:grid-cols-12 md:gap-8 items-stretch flex-1 min-h-0 px-4 md:px-0 overflow-hidden">
        {/* Left Column: List View of Requests */}
        <div className={`md:col-span-5 flex flex-col min-h-0 h-full ${activeTab !== 'list' ? 'hidden md:flex' : 'flex'}`}>
          {/* Radius Slider Filter (Desktop only) */}
          {renderRadiusSlider("hidden md:block mb-5")}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-4 my-auto">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="text-slate-400 font-semibold text-sm">Searching for requests nearby...</p>
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-2 animate-in fade-in duration-500 overflow-y-auto pr-1 flex-1 h-full overscroll-contain">
              {requests.map(req => (
                <PublicRequestCard 
                  key={req._id} 
                  request={req} 
                  onAccept={handleAcceptRequest} 
                  currentLocation={currentLocation}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4 my-auto">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100/80 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <MapPin size={30} className="text-slate-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">No active requests nearby</h3>
              <p className="text-sm text-slate-400 font-semibold">There are no public cash or UPI requests nearby right now. Try expanding your search radius!</p>
            </div>
          )}
        </div>

        {/* Right Column: Leaflet Map */}
        <div className={`md:col-span-7 flex flex-col min-h-0 h-full ${activeTab !== 'map' ? 'hidden md:flex' : 'flex'}`}>
          {currentLocation && (
            <div className="w-full relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_10px_35px_rgba(15,23,42,0.04)] z-10 flex flex-col h-[490px] md:h-full bg-white p-1.5">
              <MapContainer
                center={[currentLocation.latitude, currentLocation.longitude]}
                zoom={13}
                maxZoom={18}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "1.75rem"
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Marker */}
                <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={userIcon} />

                {/* Request Markers */}
                {requests.map(req => {
                  if (!req.location?.coordinates) return null;
                  const reqCoords = [req.location.coordinates[1], req.location.coordinates[0]];
                  const markerIcon = createRequestIcon(req);
                  return (
                    <Marker
                      key={req._id}
                      position={reqCoords}
                      icon={markerIcon}
                      eventHandlers={{
                        click: () => {
                          setSelectedRequest(req);
                        }
                      }}
                    />
                  );
                })}

                {/* Visual Route Polyline */}
                {selectedRequest && selectedRequest.location?.coordinates && (
                  <Polyline
                    positions={[
                      [currentLocation.latitude, currentLocation.longitude],
                      [selectedRequest.location.coordinates[1], selectedRequest.location.coordinates[0]]
                    ]}
                    color={selectedRequest.type === 'NEED_CASH' ? '#10b981' : '#4f46e5'}
                    dashArray="8, 8"
                    weight={4}
                    opacity={0.8}
                  />
                )}

                {/* Bounds and size updater */}
                <RequestsMapBoundsUpdater userLocation={currentLocation} requests={requests} />
              </MapContainer>

              {/* Slide-up details card drawer */}
              {selectedRequest && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-250/30 rounded-[2rem] p-5 shadow-2xl z-[1001] animate-in slide-in-from-bottom duration-300 flex flex-col space-y-4 shadow-slate-900/10">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <Link to={`/profile/${selectedRequest.creator?._id}`} className="flex items-center space-x-3 hover:opacity-85 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60 shadow-sm flex-shrink-0 flex items-center justify-center">
                        {selectedRequest.creator?.avatar ? (
                          <img src={selectedRequest.creator.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-650 font-bold text-xs">
                            {selectedRequest.creator?.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">{selectedRequest.creator?.username || 'Unknown User'}</h4>
                          {selectedRequest.creator?.trustScore !== undefined && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-700 font-extrabold bg-amber-50 border border-amber-100 rounded-full px-1.5 py-0.5 shadow-sm shadow-amber-100/10">
                              <Star size={9} className="fill-amber-400 text-amber-400" />
                              {Number(selectedRequest.creator.trustScore).toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-[10px] text-slate-450 font-semibold mt-1">
                          <span className="flex items-center text-slate-500">
                            <MapPin size={11} className="mr-0.5 text-indigo-500" />
                            {currentLocation && selectedRequest.location?.coordinates
                              ? `${calculateDistance(
                                  currentLocation.latitude,
                                  currentLocation.longitude,
                                  selectedRequest.location.coordinates[1],
                                  selectedRequest.location.coordinates[0]
                                  ).toFixed(1)} km away`
                              : 'Nearby'}
                          </span>
                          {selectedRequest.creator?.totalReviews > 0 && (
                            <>
                              <span className="mx-1.5 text-slate-300 font-light">•</span>
                              <span className="text-slate-400 font-medium">{selectedRequest.creator.totalReviews} review{selectedRequest.creator.totalReviews !== 1 ? 's' : ''}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                    
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-lg text-indigo-650 font-extrabold">₹{selectedRequest.amount}</span>
                      <button
                        onClick={() => setSelectedRequest(null)}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-650 flex items-center justify-center"
                      >
                        <span className="text-xs font-black">✕</span>
                      </button>
                    </div>
                  </div>

                  {/* Swap Info & Note */}
                  <div className="space-y-2">
                    {selectedRequest.type === 'NEED_CASH' ? (
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-lg text-[9px] font-extrabold uppercase tracking-wider select-none">
                        <span className="font-semibold text-slate-400 lowercase">pays</span>
                        <span className="font-black">UPI</span>
                        <span className="text-emerald-400 font-black">➔</span>
                        <span className="font-semibold text-slate-400 lowercase">needs</span>
                        <span className="font-black">Cash</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-750 border border-indigo-100/50 rounded-lg text-[9px] font-extrabold uppercase tracking-wider select-none">
                        <span className="font-semibold text-slate-400 lowercase">pays</span>
                        <span className="font-black">Cash</span>
                        <span className="text-indigo-400 font-black">➔</span>
                        <span className="font-semibold text-slate-400 lowercase">needs</span>
                        <span className="font-black">UPI</span>
                      </div>
                    )}

                    {selectedRequest.note && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100/60 p-2.5 rounded-xl font-semibold leading-relaxed max-h-16 overflow-y-auto shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
                        {selectedRequest.note}
                      </p>
                    )}
                  </div>

                  {/* Accept Button */}
                  <button
                    onClick={async () => {
                      setIsAcceptingFromMap(true);
                      try {
                        await handleAcceptRequest(selectedRequest._id);
                        setSelectedRequest(null);
                      } catch (err) {
                        // Error is handled in handleAcceptRequest
                      } finally {
                        setIsAcceptingFromMap(false);
                      }
                    }}
                    disabled={isAcceptingFromMap}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-650 hover:to-indigo-600 text-white rounded-2xl font-black text-xs shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center disabled:opacity-50"
                  >
                    {selectedRequest.status === 'COMPLETED' ? 'Swap Completed' : isAcceptingFromMap ? <Loader2 className="animate-spin" size={14} /> : 'I can help'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindRequests;
