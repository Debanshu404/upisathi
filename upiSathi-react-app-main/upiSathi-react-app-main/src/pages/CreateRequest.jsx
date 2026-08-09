import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Banknote, Smartphone, Loader2 } from 'lucide-react';
import { useCreateRequest } from '../hooks/useExchanges';
import { locationContext } from '../context/LocationContext';

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
      setError('Please select a request type.');
      return;
    }
    if (step === 2 && (!formData.amount || formData.amount <= 0)) {
      setError('Please enter a valid amount.');
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
        throw new Error('Location coordinates are not available. Please allow location access to continue.');
      }
      const payload = {
        ...formData,
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

  return (
    <div className="flex flex-col h-full max-w-md mx-auto pt-4 relative">
      <div className="flex items-center space-x-4 mb-6 px-2">
        <button 
          onClick={() => step === 1 ? navigate(-1) : handlePrev()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Ask for Cash or UPI</h1>
      </div>

      {/* Progress Bar & Amount Ref */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-end mb-4">
          <div className="text-sm font-medium text-gray-500">Step {step} of 4</div>
          {formData.amount && (
            <div className="text-lg font-bold text-primary">
              ₹{formData.amount}
              {formData.type && <span className="text-xs text-gray-500 ml-1">({formData.type === 'NEED_CASH' ? 'Cash' : 'UPI'})</span>}
            </div>
          )}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="px-4 mb-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        </div>
      )}

      {/* Form Steps */}
      <div className="px-4 flex-1">
        
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold mb-2">What do you need?</h2>
              <p className="text-gray-500 text-sm mb-6">Select the type of exchange you're looking for.</p>
            </div>
            
            <button 
              onClick={() => { updateForm('type', 'NEED_CASH'); setError(null); }}
              className={`w-full flex items-center p-6 border-2 rounded-2xl transition-all ${
                formData.type === 'NEED_CASH' 
                ? 'border-primary bg-blue-50/50 shadow-sm' 
                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
              }`}
            >
              <div className={`p-4 rounded-full mr-4 ${formData.type === 'NEED_CASH' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                <Banknote size={32} />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-lg text-gray-900">Get Physical Cash</h3>
                <p className="text-sm text-gray-500">Pay with UPI, get cash in hand.</p>
              </div>
              {formData.type === 'NEED_CASH' && <Check className="text-primary" size={24} />}
            </button>

            <button 
              onClick={() => { updateForm('type', 'NEED_UPI'); setError(null); }}
              className={`w-full flex items-center p-6 border-2 rounded-2xl transition-all ${
                formData.type === 'NEED_UPI' 
                ? 'border-primary bg-blue-50/50 shadow-sm' 
                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
              }`}
            >
              <div className={`p-4 rounded-full mr-4 ${formData.type === 'NEED_UPI' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                <Smartphone size={32} />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-lg text-gray-900">Get UPI Transfer</h3>
                <p className="text-sm text-gray-500">Give physical cash, get UPI in bank.</p>
              </div>
              {formData.type === 'NEED_UPI' && <Check className="text-primary" size={24} />}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold mb-2">How much?</h2>
              <p className="text-gray-500 text-sm mb-6">Enter the amount you want to exchange.</p>
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
              <input 
                type="number" 
                value={formData.amount}
                onChange={(e) => updateForm('amount', e.target.value)}
                placeholder="0"
                className="w-full text-4xl font-bold pl-12 pr-4 py-6 bg-surface border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <div className="pt-4">
              <p className="text-sm font-medium text-gray-500 mb-3">Quick select</p>
              <div className="flex space-x-3">
                {[100, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => updateForm('amount', amt)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold mb-2">Time Limit</h2>
              <p className="text-gray-500 text-sm mb-6">Set the time limit for responses.</p>
            </div>

            <div className="space-y-4 bg-surface p-6 border border-gray-100 shadow-sm rounded-2xl">
              <div className="flex justify-between items-end mb-2">
                <label className="font-bold text-gray-800">Time limit for responses</label>
                <span className="font-semibold text-primary">{formData.expiry} min</span>
              </div>
              <input 
                type="range" 
                min="5" max="60" step="5"
                value={formData.expiry}
                onChange={(e) => updateForm('expiry', parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>5 min</span>
                <span>60 min</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Your request will close automatically if no one answers in time.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold mb-2">Add instructions or meeting point (Optional)</h2>
              <p className="text-gray-500 text-sm mb-6">Help helpers find you. Let them know where you are.</p>
            </div>
            
            <textarea 
              value={formData.note}
              onChange={(e) => updateForm('note', e.target.value)}
              placeholder="e.g., I'm wearing a red jacket near the cafe..."
              className="w-full p-4 bg-surface border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-colors h-40 resize-none"
            />
          </div>
        )}

      </div>

      {/* Bottom Nav / Next Button */}
      <div className="p-4 bg-background border-t border-gray-100 pb-8">
        {step < 4 ? (
          <button 
            onClick={handleNext}
            className="w-full flex items-center justify-center py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-md"
          >
            <span>Next</span>
            <ArrowRight size={20} className="ml-2" />
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" size={24} />
            ) : (
              <span>Post Swap Request</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateRequest;
