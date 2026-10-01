import React from 'react';
import { ArrowLeftRight, Banknote, Smartphone, ShieldCheck, Zap, Star, MapPin } from 'lucide-react';

function P2PExchangeVisual() {
  return (
    <div className="w-full flex-1 flex flex-col justify-center py-2 relative select-none">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 via-white to-emerald-50/40 rounded-3xl -z-10" />

      {/* Main Interactive Simulation Card */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] space-y-4">
        {/* Top Header of Simulated Card */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Live P2P Swap Simulation</span>
          </div>
          <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full">
            Under 3 mins
          </span>
        </div>

        {/* The Two Peers Trading */}
        <div className="grid grid-cols-11 gap-2 items-center">
          {/* Peer 1: Cash Provider */}
          <div className="col-span-5 bg-gradient-to-b from-emerald-50/70 to-emerald-50/30 border border-emerald-100/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                R
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-slate-800 truncate">Rahul S.</div>
                <div className="flex items-center text-[10px] text-emerald-700 font-bold">
                  <MapPin size={10} className="mr-0.5" />
                  <span>350m away</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 rounded-xl p-2 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Banknote size={15} className="text-emerald-600" />
                <span className="text-[10px] font-bold text-slate-500">Gives Cash</span>
              </div>
              <span className="text-sm font-black text-emerald-600">₹500</span>
            </div>
          </div>

          {/* Central Swap Connector */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-sm flex items-center justify-center text-indigo-600 animate-float">
              <ArrowLeftRight size={14} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Peer 2: UPI Sender */}
          <div className="col-span-5 bg-gradient-to-b from-indigo-50/70 to-indigo-50/30 border border-indigo-100/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                P
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-slate-800 truncate">Priya M.</div>
                <div className="flex items-center text-[10px] text-amber-500 font-bold">
                  <Star size={10} className="fill-amber-400 text-amber-400 mr-0.5" />
                  <span>4.9 (42 swaps)</span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 rounded-xl p-2 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Smartphone size={15} className="text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-500">Sends UPI</span>
              </div>
              <span className="text-sm font-black text-indigo-600">₹500</span>
            </div>
          </div>
        </div>

        {/* Safe Meetup Indicator Bar */}
        <div className="bg-slate-50/90 border border-slate-200/60 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck size={13} className="stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Safe Public Spot: Metro Gate 2</span>
          </div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
            Verified Handover
          </span>
        </div>
      </div>

      {/* Feature Bullet Badges below */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="bg-white/70 border border-slate-100 rounded-2xl p-2.5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-800">100% Direct</div>
          <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Zero platform cuts</div>
        </div>
        <div className="bg-white/70 border border-slate-100 rounded-2xl p-2.5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-800">Face-to-Face</div>
          <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Check bank instantly</div>
        </div>
        <div className="bg-white/70 border border-slate-100 rounded-2xl p-2.5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-800">Real-Time</div>
          <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Instant live sockets</div>
        </div>
      </div>
    </div>
  );
}

export default P2PExchangeVisual;
