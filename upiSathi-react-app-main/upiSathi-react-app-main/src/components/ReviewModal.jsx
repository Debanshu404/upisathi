import { useEffect, useState } from 'react';
import { Star, X, Loader2, CheckCircle, ShieldCheck, MessageSquareText, AlertCircle } from 'lucide-react';
import { createReview } from '../services/api';

const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

function ReviewModal({ matchId, partner, onClose, onSubmitSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
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
    if (rating === 0) {
      setError("Please select a rating before submitting.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await createReview(matchId, rating, comment);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSubmitSuccess) onSubmitSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayRating = hoverRating || rating;

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
        aria-labelledby="review-modal-title"
      >
        {/* Background Accent Gradients */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"></div>
        <div className="absolute -top-14 -left-14 w-36 h-36 bg-amber-200/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-14 -right-14 w-36 h-36 bg-violet-200/25 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        {!isSuccess && (
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 w-9 h-9 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center disabled:opacity-40 z-10"
            aria-label="Close rating modal"
          >
            <X size={17} />
          </button>
        )}

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center px-7 py-14 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,0.12)]">
              <CheckCircle size={40} className="stroke-[2.4]" />
            </div>
            <h3 className="font-black text-slate-900 text-xl tracking-tight mt-5">Rating submitted</h3>
            <p className="text-xs font-medium text-slate-400 mt-1.5 max-w-xs leading-relaxed">
              Thanks for helping the community build trust through honest feedback.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col px-5 sm:px-7 pt-7 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="text-center px-8">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Star size={21} className="fill-amber-400 text-amber-400" />
              </div>
              <h3 id="review-modal-title" className="font-black text-slate-900 text-xl tracking-tight">Rate your swap</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                Your feedback helps others swap with confidence.
              </p>
            </div>

            {/* Partner Details */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 rounded-2xl p-3.5 mt-5">
              <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden border-2 border-white ring-1 ring-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
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
                  {partner?.username || 'Unknown User'}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  Completed swap partner
                </p>
              </div>
              <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating Selector */}
            <fieldset className="flex flex-col items-center mt-6">
              <legend className="sr-only">Choose a rating from one to five stars</legend>
              <div className="flex justify-center items-center gap-1 sm:gap-2 bg-amber-50/60 border border-amber-100/70 rounded-2xl p-2">
                {[1, 2, 3, 4, 5].map((index) => {
                  const isFilled = index <= currentDisplayRating;
                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => {
                        setRating(index);
                        setError(null);
                      }}
                      onMouseEnter={() => setHoverRating(index)}
                      onMouseLeave={() => setHoverRating(0)}
                      onFocus={() => setHoverRating(index)}
                      onBlur={() => setHoverRating(0)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-all duration-150 hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
                      aria-label={`${index} star${index > 1 ? 's' : ''}: ${ratingLabels[index]}`}
                      aria-pressed={rating === index}
                    >
                      <Star 
                        size={29}
                        className={`transition-all duration-150 ${
                          isFilled 
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_3px_8px_rgba(245,158,11,0.28)]' 
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className={`text-xs font-black h-5 mt-2 transition-colors ${currentDisplayRating ? 'text-amber-700' : 'text-slate-400'}`}>
                {currentDisplayRating ? `${currentDisplayRating}.00 · ${ratingLabels[currentDisplayRating]}` : 'Tap a star to rate'}
              </span>
            </fieldset>

            {/* Review Comment Textarea */}
            <div className="flex flex-col mt-5">
              <label htmlFor="review-comment" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                <MessageSquareText size={13} className="text-indigo-500" />
                Add a comment
                <span className="normal-case tracking-normal text-slate-400 font-semibold">(optional)</span>
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                placeholder="What went well? Was the partner punctual and trustworthy?"
                className="w-full border border-slate-200 rounded-2xl p-3.5 text-xs focus:outline-none focus:ring-4 focus:ring-indigo-100/70 focus:border-indigo-400 bg-slate-50 focus:bg-white font-medium min-h-[100px] text-slate-700 placeholder:text-slate-400 transition-all resize-none"
                disabled={isSubmitting}
              />
              <span className={`text-[9px] text-right font-bold mt-1.5 block ${
                comment.length >= 450 ? 'text-rose-500' : 'text-slate-400'
              }`}>
                {comment.length} / 500
              </span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-[0.7fr_1.3fr] gap-2.5 mt-5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-12 bg-white text-slate-500 hover:bg-slate-50 font-extrabold rounded-2xl border border-slate-200 transition-all active:scale-[0.98] text-xs cursor-pointer disabled:opacity-50"
              >
                Skip
              </button>

              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="h-12 bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all active:scale-[0.98] text-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Star size={14} className="fill-white/20" />
                    <span>Submit Rating</span>
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

export default ReviewModal;
