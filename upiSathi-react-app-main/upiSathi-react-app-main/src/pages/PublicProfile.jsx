import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Star, Loader2, BadgeCheck, MessageSquareQuote, Sparkles, Calendar } from 'lucide-react';
import { usePublicProfile } from '../hooks/useUser';
import { useUserReviews } from '../hooks/useReviews';
import React, { useRef, useEffect } from 'react';

function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const sentinelRef = useRef(null);

  const { data: rawProfileData, isLoading, error } = usePublicProfile(userId);
  const {
    data: rawReviewsData,
    isLoading: isLoadingReviews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useUserReviews(userId, {
    enabled: !!userId,
  });

  const profileData = rawProfileData?.data || rawProfileData || null;
  const displayedRating = Number(profileData?.trustScore || 0).toFixed(2);
  const reviewsList = rawReviewsData?.pages
    ? rawReviewsData.pages.flatMap(page => page?.data?.reviews || page?.reviews || [])
    : [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !sentinelRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    }, {
      root: sentinelRef.current.parentElement,
      threshold: 0.1
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const formattedJoinDate = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric'
      })
    : '';

  return (
    <div className="w-full max-w-5xl mx-auto pt-3 sm:pt-6 pb-20 px-1 sm:px-4">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4 mb-6 px-1">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
        >
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600 mb-0.5">
            <Sparkles size={12} />
            Public Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {profileData?.username || 'User Profile'}
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <span className="text-xs text-slate-400 font-bold">Loading public profile...</span>
        </div>
      ) : error || !profileData ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-sm">Failed to Load Profile</h3>
          <p className="text-xs text-slate-450 text-slate-400 font-semibold max-w-xs mt-2 leading-relaxed">
            {error?.message || 'We could not fetch details for this user. Please try again later.'}
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs"
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5 items-start">
          <div className="space-y-5">
            {/* Profile Details Card */}
            <section className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-[0_12px_40px_rgba(15,23,42,0.06)] animate-in fade-in duration-350">
              <div className="h-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-500 relative overflow-hidden">
                <div className="absolute -right-8 -top-14 w-36 h-36 rounded-full border border-white/15"></div>
                <div className="absolute right-8 -top-10 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
              </div>

              <div className="px-6 pb-6 -mt-12 relative">
                <div className="flex items-end justify-between gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-slate-100 rounded-3xl overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                      {profileData.avatar ? (
                        <img 
                          src={profileData.avatar} 
                          alt={`${profileData.username} avatar`} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-500 font-black text-3xl">
                          {profileData.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <span className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full bg-emerald-500 text-white border-4 border-white flex items-center justify-center">
                      <BadgeCheck size={14} strokeWidth={3} />
                    </span>
                  </div>
                  <span className="mb-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    <Shield size={12} />
                    Trusted member
                  </span>
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profileData.username}</h2>
                  {formattedJoinDate && (
                    <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                      <Calendar size={12} />
                      <p className="text-xs font-semibold">Joined {formattedJoinDate}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="rounded-2xl bg-amber-50/70 border border-amber-100/70 p-4">
                    <div className="flex items-center gap-1.5">
                      <Star size={16} className="fill-amber-400 text-amber-400" />
                      <span className="font-black text-xl text-slate-900 tracking-tight">{displayedRating}</span>
                    </div>
                    <span className="text-[9px] text-amber-700/70 font-black uppercase tracking-wider block mt-1">Trust score</span>
                  </div>

                  <div className="rounded-2xl bg-indigo-50/70 border border-indigo-100/70 p-4">
                    <div className="flex items-center gap-1.5">
                      <MessageSquareQuote size={16} className="text-indigo-500" />
                      <span className="font-black text-xl text-slate-900 tracking-tight">{profileData.totalReviews || 0}</span>
                    </div>
                    <span className="text-[9px] text-indigo-700/70 font-black uppercase tracking-wider block mt-1">Total reviews</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Reviews Received Card */}
          <section className="bg-white border border-slate-100 rounded-[2rem] p-5 sm:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] min-h-[340px] animate-in fade-in duration-350">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="font-black text-slate-900 text-lg tracking-tight">Reviews</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Feedback from completed swaps with this user.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl px-3 py-2 flex-shrink-0">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-black">{displayedRating}</span>
              </span>
            </div>

            {isLoadingReviews ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="animate-spin text-indigo-600" size={22} />
                <span className="text-[10px] text-slate-400 font-bold">Loading reviews...</span>
              </div>
            ) : reviewsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-indigo-500 mb-3">
                  <MessageSquareQuote size={21} />
                </div>
                <h4 className="text-sm font-extrabold text-slate-700">No reviews yet</h4>
                <p className="text-[10px] text-slate-400 font-semibold max-w-xs mt-1.5 leading-relaxed">
                  No feedback has been recorded for this helper yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[570px] overflow-y-auto pr-1">
                {reviewsList.map((review) => (
                  <article 
                    key={review._id} 
                    className="bg-gradient-to-br from-white to-slate-50/70 border border-slate-200/70 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200 hover:border-indigo-100 hover:shadow-[0_6px_20px_rgba(99,102,241,0.05)] transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                          {review.reviewer?.avatar ? (
                            <img 
                              src={review.reviewer.avatar} 
                              alt={`${review.reviewer?.username || 'Reviewer'} avatar`} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            review.reviewer?.username?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-800 text-xs leading-none truncate">
                            {review.reviewer?.username || 'Swap partner'}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-bold block mt-1">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 flex-shrink-0">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-black text-amber-700">
                          {Number(review.rating || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white border border-slate-100 rounded-xl px-3.5 py-3">
                        “{review.comment}”
                      </p>
                    )}
                  </article>
                ))}
                {hasNextPage && (
                  <div ref={sentinelRef} className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-indigo-650" size={20} />
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default PublicProfile;
