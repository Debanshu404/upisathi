import { useEffect, useState } from 'react';
import { X, Loader2, CheckCircle, AlertTriangle, MessageSquareText, AlertCircle } from 'lucide-react';
import { createReport } from '../services/api';

const reportReasons = [
  { value: 'SPAM', label: 'Spam or Advertising' },
  { value: 'FAKE_PROFILE', label: 'Fake Profile / Impersonator' },
  { value: 'HARASSMENT', label: 'Harassment or Abuse' },
  { value: 'SCAM_ATTEMPT', label: 'Scam or Fraudulent Attempt' },
  { value: 'USER_DID_NOT_SHOW_UP', label: 'Partner Did Not Show Up' },
  { value: 'FAKE_CASH', label: 'Fake / Counterfeit Cash' },
  { value: 'FAKE_PAYMENT_PROOF', label: 'Fake UPI Payment Proof' },
  { value: 'INAPPROPRIATE_BEHAVIOR', label: 'Inappropriate Behavior' },
  { value: 'OTHER', label: 'Other Reason' }
];

function ReportModal({ matchId, partner, onClose, onSubmitSuccess }) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting && !isSuccess) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, isSuccess, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      setError("Please select a reason for reporting.");
      return;
    }

    const trimmedDesc = description.trim();
    if (trimmedDesc.length > 0 && trimmedDesc.length < 10) {
      setError("Please provide more details (minimum 10 characters).");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      // If description is empty, do not send it (passes optional min-10 zod validation)
      const descParam = trimmedDesc.length >= 10 ? trimmedDesc : undefined;
      
      await createReport(partner?._id, matchId, reason, descParam);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSubmitSuccess) onSubmitSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/65 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onMouseDown={() => {
        if (!isSubmitting && !isSuccess) onClose();
      }}
    >
      <div 
        className="bg-white rounded-t-[2rem] sm:rounded-[2rem] max-w-md w-full shadow-[0_24px_80px_rgba(15,23,42,0.3)] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 border border-slate-100 flex flex-col relative overflow-hidden max-h-[94dvh] overflow-y-auto hide-scrollbar"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        {/* Background Accent Gradients */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"></div>
        <div className="absolute -top-14 -left-14 w-36 h-36 bg-rose-200/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-14 -right-14 w-36 h-36 bg-orange-200/25 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        {!isSuccess && (
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 w-9 h-9 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center disabled:opacity-40 z-10"
            aria-label="Close report modal"
          >
            <X size={17} />
          </button>
        )}

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center px-7 py-14 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,0.12)] animate-pulse">
              <CheckCircle size={40} className="stroke-[2.4]" />
            </div>
            <h3 className="font-black text-slate-900 text-xl tracking-tight mt-5">Report Submitted</h3>
            <p className="text-xs font-medium text-slate-400 mt-1.5 max-w-xs leading-relaxed">
              We have received your report and will review it immediately. Thank you for keeping the platform safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col px-5 sm:px-7 pt-7 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="text-center px-8">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle size={21} className="stroke-[2.2]" />
              </div>
              <h3 id="report-modal-title" className="font-black text-slate-900 text-xl tracking-tight">Report Partner</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                Help us keep our community safe and trusted.
              </p>
            </div>

            {/* Partner Details */}
            {partner && (
              <div className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 rounded-2xl p-3.5 mt-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border-2 border-white ring-1 ring-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
                  {partner?.avatar ? (
                    <img src={partner.avatar} alt={`${partner?.username || 'Swap partner'} avatar`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 font-black text-sm">
                      {partner?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug truncate">
                    {partner?.username || 'Swap Partner'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    Match associated report
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Report Reason Grid Selection */}
            <div className="flex flex-col mt-4">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2 block">
                Select a reason
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {reportReasons.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => {
                      setReason(item.value);
                      setError(null);
                    }}
                    className={`flex items-center text-left p-3 rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                      reason === item.value
                        ? 'border-rose-500 bg-rose-50/50 text-rose-700 font-extrabold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border mr-3 flex items-center justify-center flex-shrink-0 ${
                      reason === item.value
                        ? 'border-rose-500 bg-rose-500'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {reason === item.value && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Report Details Textarea */}
            <div className="flex flex-col mt-4">
              <label htmlFor="report-description" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                <MessageSquareText size={13} className="text-rose-500" />
                Describe what happened
                <span className="normal-case tracking-normal text-slate-400 font-semibold">(optional, min 10 chars)</span>
              </label>
              <textarea
                id="report-description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.slice(0, 500));
                  if (error && e.target.value.trim().length >= 10) {
                    setError(null);
                  }
                }}
                placeholder="Please provide details (e.g. partner didn't arrive, fake transfer status, inappropriate language, etc.)"
                className="w-full border border-slate-200 rounded-2xl p-3 text-xs focus:outline-none focus:ring-4 focus:ring-rose-100/70 focus:border-rose-450 bg-slate-50 focus:bg-white font-medium min-h-[90px] text-slate-700 placeholder:text-slate-400 transition-all resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-[9px] text-slate-400 font-semibold">
                  {description.trim().length > 0 && description.trim().length < 10 && (
                    <span className="text-rose-500 font-bold">Needs {10 - description.trim().length} more characters</span>
                  )}
                </span>
                <span className={`text-[9px] font-bold ${
                  description.length >= 450 ? 'text-rose-500' : 'text-slate-400'
                }`}>
                  {description.length} / 500
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-[0.7fr_1.3fr] gap-2.5 mt-5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-12 bg-white text-slate-500 hover:bg-slate-50 font-extrabold rounded-2xl border border-slate-200 transition-all active:scale-[0.98] text-xs cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !reason || (description.trim().length > 0 && description.trim().length < 10)}
                className="h-12 bg-gradient-to-br from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 transition-all active:scale-[0.98] text-xs disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} className="stroke-[2.5]" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportModal;
