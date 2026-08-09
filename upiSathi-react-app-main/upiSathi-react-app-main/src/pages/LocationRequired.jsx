import React, { useContext, useState } from "react";
import { MapPin, Compass, ArrowRight, Loader2, Info, RefreshCw } from "lucide-react";
import { locationContext } from "../context/LocationContext";

function LocationRequired() {
  const { locationPermission, requestLocation } = useContext(locationContext);
  const [isRequesting, setIsRequesting] = useState(false);
  const [activeTab, setActiveTab] = useState("chrome"); // 'chrome' | 'safari' | 'mobile'

  const handleEnableLocation = async () => {
    setIsRequesting(true);
    try {
      await requestLocation();
    } catch (err) {
      console.error("Location request failed:", err);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const isDenied = locationPermission === "denied";
  const isGranted = locationPermission === "granted";

  if (isGranted) {
    return (
      <div className="min-h-screen bg-slate-50/60 relative overflow-hidden flex flex-col justify-center items-center p-4 md:p-8 select-none">
        {/* Premium Background Mesh Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>

        {/* Premium Glassmorphic Card Container */}
        <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/60 rounded-[36px] p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.01)] text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="flex justify-center">
            <div className="relative w-24 h-24 bg-gradient-to-tr from-indigo-50/80 to-indigo-100/50 border border-indigo-100/60 rounded-full flex items-center justify-center shadow-inner">
              {/* Radar Sweeping Rings */}
              <div className="absolute inset-[-4px] rounded-full border border-indigo-200/30 animate-ping" style={{ animationDuration: '2.5s' }}></div>
              <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-pulse" style={{ animationDuration: '2s' }}></div>
              <div className="relative w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Compass className="text-white w-7 h-7 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              🔍 Locating You...
            </h1>
            <p className="text-sm text-slate-400 font-semibold leading-relaxed px-4">
              Permission granted! We are securely fetching your coordinates to find peer matches nearby.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <div className="flex items-center space-x-2 bg-indigo-50/50 px-4 py-2.5 rounded-full border border-indigo-100/30 shadow-sm">
              <Loader2 className="animate-spin text-indigo-600" size={16} />
              <span className="text-xs font-extrabold text-indigo-600">Retrieving GPS coordinates</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 relative overflow-hidden flex flex-col justify-center items-center p-4 md:p-8 select-none">
      {/* Premium Background Mesh Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-[35%] right-[10%] w-[30%] h-[30%] bg-violet-200/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Premium Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/60 rounded-[36px] p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.01)] text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Icon Container */}
        <div className="flex justify-center">
          {isDenied ? (
            <div className="relative w-24 h-24 bg-gradient-to-tr from-rose-50/80 to-rose-100/50 border border-rose-100/60 rounded-full flex items-center justify-center animate-bounce shadow-inner">
              <div className="absolute inset-[-4px] rounded-full border border-rose-200/30 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-rose-500/5 animate-pulse"></div>
              <div className="relative w-14 h-14 bg-gradient-to-tr from-rose-600 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-600/30">
                <MapPin className="text-white w-7 h-7" />
              </div>
            </div>
          ) : (
            <div className="relative w-24 h-24 bg-gradient-to-tr from-indigo-50/80 to-indigo-100/50 border border-indigo-100/60 rounded-full flex items-center justify-center shadow-inner">
              {/* Radar Sweeping Rings */}
              <div className="absolute inset-[-4px] rounded-full border border-indigo-200/30 animate-ping" style={{ animationDuration: '2.5s' }}></div>
              <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-pulse" style={{ animationDuration: '2s' }}></div>
              <div className="relative w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Compass className="text-white w-7 h-7 animate-spin-slow" />
              </div>
            </div>
          )}
        </div>

        {/* Text Header Content */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            📍 Location Required
          </h1>
          
          {isDenied ? (
            <div className="space-y-2">
              <p className="text-sm font-bold text-rose-500 tracking-wide uppercase">
                Location access was denied.
              </p>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed px-2">
                PeerSync cannot find nearby exchange partners without your location.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 font-semibold leading-relaxed px-2">
              PeerSync uses your location to connect you with nearby people for cash and UPI exchanges.
            </p>
          )}
        </div>

        {/* Dynamic Feature List or Interactive Tabbed Instructions */}
        {!isDenied ? (
          <div className="space-y-3.5 text-left">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50/50 to-white/30 border border-slate-100/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm shadow-indigo-100/50">
                <span className="font-black text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Find nearby requests</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Instantly discover who needs cash or UPI near you.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50/50 to-white/30 border border-slate-100/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm shadow-indigo-100/50">
                <span className="font-black text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Show accurate distances</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Verify exactly how many kilometers away partners are.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50/50 to-white/30 border border-slate-100/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm shadow-indigo-100/50">
                <span className="font-black text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Match with people in your area</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Securely trade within a comfortable walking distance.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Interactive Tabs Header */}
            <div className="flex bg-slate-100/80 backdrop-blur-sm p-1 rounded-2xl text-xs font-bold text-slate-500 border border-slate-200/30">
              <button
                onClick={() => setActiveTab("chrome")}
                className={`flex-1 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "chrome"
                    ? "bg-white text-indigo-600 shadow-md shadow-indigo-600/5 font-extrabold scale-[1.02]"
                    : "hover:bg-white/40 hover:text-slate-700"
                }`}
              >
                Chrome / Edge
              </button>
              <button
                onClick={() => setActiveTab("safari")}
                className={`flex-1 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "safari"
                    ? "bg-white text-indigo-600 shadow-md shadow-indigo-600/5 font-extrabold scale-[1.02]"
                    : "hover:bg-white/40 hover:text-slate-700"
                }`}
              >
                Safari
              </button>
              <button
                onClick={() => setActiveTab("mobile")}
                className={`flex-1 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "mobile"
                    ? "bg-white text-indigo-600 shadow-md shadow-indigo-600/5 font-extrabold scale-[1.02]"
                    : "hover:bg-white/40 hover:text-slate-700"
                }`}
              >
                Mobile
              </button>
            </div>

            {/* Tabbed Step-by-Step Instructions */}
            <div className="bg-slate-50/70 border border-slate-100/80 rounded-[24px] p-5.5 text-left text-xs text-slate-500 min-h-[180px] flex flex-col justify-center shadow-inner relative overflow-hidden">
              <div className="flex items-center space-x-1.5 font-bold text-slate-700 text-[10px] uppercase tracking-wider mb-3">
                <Info size={14} className="text-slate-400" />
                <span>How to activate location:</span>
              </div>

              {activeTab === "chrome" && (
                <ol className="list-decimal list-inside space-y-2.5 font-semibold text-slate-400">
                  <li>
                    Click the settings icon (lock <strong className="text-slate-700 font-bold">🔒</strong> or tune symbol) in the left corner of your address bar.
                  </li>
                  <li>
                    Locate <strong className="text-slate-600 font-bold">Location</strong> in the settings dropdown list.
                  </li>
                  <li>
                    Toggle the setting to <strong className="text-indigo-600 font-extrabold">Allow</strong>.
                  </li>
                  <li>
                    Click <strong className="text-slate-600 font-bold">Reload Page</strong> below to re-verify.
                  </li>
                </ol>
              )}

              {activeTab === "safari" && (
                <ol className="list-decimal list-inside space-y-2.5 font-semibold text-slate-400">
                  <li>
                    Open the top menu and select <strong className="text-slate-700 font-bold">Safari &gt; Settings for This Website...</strong>
                  </li>
                  <li>
                    Look for the <strong className="text-slate-600 font-bold">Location</strong> menu options.
                  </li>
                  <li>
                    Select <strong className="text-indigo-600 font-extrabold">Allow</strong> in the dropdown menu.
                  </li>
                  <li>
                    Click <strong className="text-slate-600 font-bold">Reload Page</strong> below to refresh.
                  </li>
                </ol>
              )}

              {activeTab === "mobile" && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wide mb-1.5">Safari (iOS)</h5>
                    <ol className="list-decimal list-inside space-y-1 font-semibold text-slate-400">
                      <li>Open iOS <strong className="text-slate-600 font-bold">Settings</strong> and select <strong className="text-slate-600 font-bold">Privacy &amp; Security</strong>.</li>
                      <li>Go to <strong className="text-slate-600 font-bold">Location Services &gt; Safari Websites</strong>.</li>
                      <li>Choose <strong className="text-indigo-600 font-extrabold">While Using the App</strong>.</li>
                    </ol>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wide mb-1.5">Chrome (Android)</h5>
                    <ol className="list-decimal list-inside space-y-1 font-semibold text-slate-400">
                      <li>Tap the 3 dots menu and select <strong className="text-slate-600 font-bold">Site Settings &gt; Location</strong>.</li>
                      <li>Select PeerSync and choose <strong className="text-indigo-600 font-extrabold">Allow</strong>.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button Section */}
        <div className="pt-2">
          {isDenied ? (
            <button
              onClick={handleReload}
              className="w-full flex items-center justify-center py-4 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-2xl shadow-lg shadow-slate-800/10 active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
            >
              <RefreshCw size={16} className="mr-2" />
              <span>Reload Page</span>
            </button>
          ) : (
            <button
              onClick={handleEnableLocation}
              disabled={isRequesting}
              className="w-full flex items-center justify-center py-4 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
            >
              {isRequesting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  <span>Securing location...</span>
                </>
              ) : (
                <>
                  <span>Enable Location</span>
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default LocationRequired;
