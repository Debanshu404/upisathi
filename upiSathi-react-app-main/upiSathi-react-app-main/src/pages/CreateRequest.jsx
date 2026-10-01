import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Banknote, Smartphone, Loader2, Clock, Sparkles, MapPin } from 'lucide-react';
import { useCreateRequest } from '../hooks/useExchanges';
import { locationContext } from '../context/LocationContext';

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000];
const SPOT_PRESETS = [
  'Near Metro Exit Gate',
  'Outside Coffee Shop',
  'Beside ATM / Bank Branch',
  'At Main Road Entrance',
  'Outside Grocery Store'
];

function CreateRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedType = location.state?.type;
  const { currentLocation } = useContext(locationContext);

  const [step, setStep] = useState(preSelectedType ? 2 : 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    type: preSelectedType || '',
    amount: '',
    expiry: 20,
    note: ''
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && !formData.type) {
      setError('Please select what type of exchange you need.');
      return;
    }
    if (step === 2 && (!formData.amount || Number(formData.amount) <= 0)) {
      setError('Please enter a valid swap amount.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const createRequestMutation = useCreateRequest();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!currentLocation) {
        throw new Error('Location coordinates are not available. Please allow GPS access to proceed.');
      }
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        coordinates: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        }
      };
      await createRequestMutation.mutateAsync(payload);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create request');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetNote = (preset) => {
    setFormData(prev => ({
      ...prev,
      note: prev.note ? `${prev.note} (${preset})` : preset
    }));
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto pt-2 pb-12 relative animate-in fade-in duration-300 text-slate-800 dark:text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => step === 1 ? navigate(-1) : handlePrev()}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-[#272625] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-center text-slate-700 dark:text-white hover:text-indigo-600 dark:hover:text-orange-400 hover:border-indigo-200 transition-all active:scale-95 cursor-pointer"
            title="Back"
          >
            <ArrowLeft size={18} className="stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Create Swap Request</h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mt-0.5">Find someone nearby to exchange cash or digital money</p>
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white dark:bg-[#272625] border border-slate-200/70 dark:border-white/10 rounded-2xl p-4 mb-6 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-indigo-600 dark:text-[#e8400d] uppercase tracking-wider">Step {step} of 4</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {step === 1 && "Choose Swap Mode"}
              {step === 2 && "Enter Amount"}
              {step === 3 && "Set Expiry Timer"}
              {step === 4 && "Meetup Instructions"}
            </span>
          </div>
          {formData.amount && (
            <span className="text-sm font-black text-indigo-600 dark:text-[#e8400d] bg-indigo-50 dark:bg-white/10 px-2.5 py-0.5 rounded-lg border border-indigo-100 dark:border-white/15">
              ₹{formData.amount}
            </span>
          )}
        </div>

        {/* Stepper indicator dots and bar */}
        <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-[#e8400d] dark:to-orange-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-200/80 dark:border-rose-800/40 flex items-center space-x-2.5 animate-shake">
          <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px]">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* Wizard Steps */}
      <div className="bg-white dark:bg-[#272625] border border-slate-200/70 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.03)] flex-1 flex flex-col justify-between transition-colors">
        
        {/* Step 1: Swap Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">What exchange do you need?</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mt-1">Select the swap direction that fits your immediate situation.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Need Physical Cash Option */}
              <button 
                type="button"
                onClick={() => { updateForm('type', 'NEED_CASH'); setError(null); }}
                className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all duration-200 text-left active:scale-98 cursor-pointer relative overflow-hidden ${
                  formData.type === 'NEED_CASH' 
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-md shadow-emerald-500/10' 
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/60 dark:hover:bg-white/5'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shrink-0 transition-colors ${
                  formData.type === 'NEED_CASH' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                }`}>
                  <Banknote size={28} className="stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-slate-800 dark:text-white text-base">I Need Physical Cash</h3>
                    <span className="text-[10px] font-black uppercase bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300 font-semibold mt-1">You pay via UPI, nearby partner hands you physical cash notes.</p>
                </div>
                {formData.type === 'NEED_CASH' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Need Digital UPI Option */}
              <button 
                type="button"
                onClick={() => { updateForm('type', 'NEED_UPI'); setError(null); }}
                className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all duration-200 text-left active:scale-98 cursor-pointer relative overflow-hidden ${
                  formData.type === 'NEED_UPI' 
                    ? 'border-indigo-600 dark:border-[#e8400d] bg-indigo-50/40 dark:bg-orange-950/30 shadow-md shadow-indigo-600/10' 
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/60 dark:hover:bg-white/5'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shrink-0 transition-colors ${
                  formData.type === 'NEED_UPI' ? 'bg-indigo-600 dark:bg-[#e8400d] text-white shadow-md shadow-indigo-600/20' : 'bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400'
                }`}>
                  <Smartphone size={28} className="stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="font-black text-slate-800 dark:text-white text-base">I Need Digital Money (UPI)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300 font-semibold mt-1">You hand over cash, partner transfers money to your UPI ID instantly.</p>
                </div>
                {formData.type === 'NEED_UPI' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 dark:bg-[#e8400d] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Amount Entry */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">How much do you want to swap?</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mt-1">Enter the exact rupee amount. Zero platform fees are deducted.</p>
            </div>
            
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-400">₹</span>
              <input 
                type="number" 
                value={formData.amount}
                onChange={(e) => updateForm('amount', e.target.value)}
                placeholder="500"
                min="10"
                max="50000"
                className="w-full text-4xl sm:text-5xl font-black pl-14 pr-4 py-5 bg-slate-50/80 dark:bg-[#1a1918] border-2 border-slate-200 dark:border-white/10 rounded-3xl focus:border-indigo-600 dark:focus:border-[#e8400d] focus:bg-white dark:focus:bg-[#1a1918] focus:outline-none transition-all text-slate-800 dark:text-white shadow-inner"
                autoFocus
              />
            </div>

            {/* Quick Amount Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">Quick Select</span>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-[#e8400d]">Standard Indian currency notes</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {QUICK_AMOUNTS.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => updateForm('amount', amt)}
                    className={`py-3 rounded-2xl font-black text-sm transition-all active:scale-95 cursor-pointer border ${
                      Number(formData.amount) === amt 
                        ? 'bg-indigo-600 dark:bg-[#e8400d] text-white border-indigo-600 dark:border-[#e8400d] shadow-md' 
                        : 'bg-slate-100/70 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border-slate-200/60 dark:border-white/10'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Timer & Radius Limit */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">Response Time Limit</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mt-1">How long should your request stay open before auto-closing?</p>
            </div>

            <div className="bg-slate-50 dark:bg-[#1a1918] border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-extrabold text-sm">
                  <Clock size={16} className="text-indigo-600 dark:text-[#e8400d]" />
                  <span>Closing Timer</span>
                </div>
                <span className="font-black text-indigo-600 dark:text-[#e8400d] bg-white dark:bg-[#272625] px-3 py-1 rounded-xl border border-indigo-100 dark:border-white/10 text-sm shadow-sm">
                  {formData.expiry} minutes
                </span>
              </div>

              <input 
                type="range" 
                min="5" 
                max="60" 
                step="5"
                value={formData.expiry}
                onChange={(e) => updateForm('expiry', parseInt(e.target.value))}
                className="w-full accent-indigo-600 dark:accent-[#e8400d] h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-400 font-bold">
                <span>5 mins (Quick)</span>
                <span>20 mins (Recommended)</span>
                <span>60 mins (Relaxed)</span>
              </div>

              <div className="p-3 bg-indigo-50/60 dark:bg-white/5 border border-indigo-100 dark:border-white/10 rounded-2xl flex items-center space-x-2 text-xs font-semibold text-indigo-800 dark:text-indigo-300">
                <Sparkles size={14} className="shrink-0 text-indigo-600 dark:text-[#e8400d]" />
                <span>Nearby users typically offer assistance in under 4 minutes.</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Meeting Spot Note */}
        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">Meeting Point / Note (Optional)</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mt-1">Specify where you would like to meet in person to coordinate the swap.</p>
            </div>

            {/* Quick Chip Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">Tap to insert spot suggestion:</span>
              <div className="flex flex-wrap gap-2">
                {SPOT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetNote(preset)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-orange-400 hover:border-indigo-200 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-200/60 dark:border-white/10 active:scale-95 cursor-pointer"
                  >
                    <MapPin size={11} />
                    <span>{preset}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <textarea 
              value={formData.note}
              onChange={(e) => updateForm('note', e.target.value)}
              placeholder="e.g., I'm waiting near the Metro ticket counter wearing a blue shirt..."
              className="w-full p-4 bg-slate-50/80 dark:bg-[#1a1918] border-2 border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-[#e8400d] focus:bg-white dark:focus:bg-[#1a1918] focus:outline-none transition-all h-36 resize-none text-sm text-slate-800 dark:text-white font-medium"
            />
          </div>
        )}

        {/* Step Controls / Next Button */}
        <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between space-x-3 mt-6">
          {step > 1 ? (
            <button 
              type="button"
              onClick={handlePrev}
              className="px-5 py-3.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-white rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer"
            >
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button 
              type="button"
              onClick={handleNext}
              className="flex-1 max-w-[200px] flex items-center justify-center py-3.5 bg-[#111111] dark:bg-[#e8400d] hover:bg-[#272625] dark:hover:bg-[#d03709] text-white rounded-2xl font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight size={16} className="ml-1.5" />
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center py-4 bg-[#111111] dark:bg-[#e8400d] hover:bg-[#272625] dark:hover:bg-[#d03709] text-white rounded-2xl font-extrabold text-base shadow-lg shadow-black/10 transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <span>Publishing Request...</span>
                </>
              ) : (
                <span>Post Swap Request Now</span>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default CreateRequest;
