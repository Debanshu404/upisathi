import { useContext, useState, useEffect, useRef } from 'react';
import { Shield, Info, ChevronDown, ChevronUp, Star, Loader2, BadgeCheck, Mail, MessageSquareQuote, Sparkles, Lock, KeyRound, Eye, EyeOff, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../context/UserContext';
import { useMyReviews } from '../hooks/useReviews';
import { getPasswordStatus, setPassword, changePassword, sendOtp, verifyOtp, logoutUser, getMyReports } from '../services/api';

function Profile() {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Password status states
  const [passStatus, setPassStatus] = useState(null);
  const [loadingPassStatus, setLoadingPassStatus] = useState(true);

  // Modal / Form states
  const [modalType, setModalType] = useState(null); // 'set' or 'change' or null
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState(null);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const fetchReports = async () => {
    setLoadingReports(true);
    setReportsError(null);
    try {
      const res = await getMyReports();
      const data = res.data || res;
      setReports(data.reports || []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setReportsError(err.message || "Failed to load reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const sentinelRef = useRef(null);

  const fetchPassStatus = async () => {
    try {
      const res = await getPasswordStatus();
      setPassStatus(res.data || res);
    } catch (err) {
      console.error("Failed to load password status:", err);
    } finally {
      setLoadingPassStatus(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPassStatus();
      fetchReports();
    }
  }, [user]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendOtp = async () => {
    setModalError(null);
    setModalLoading(true);
    const purpose = modalType === "set" ? "SET_PASSWORD" : "CHANGE_PASSWORD";
    try {
      await sendOtp(user.email, purpose);
      setOtpSent(true);
      setCooldown(60);
    } catch (err) {
      setModalError(err.message || "Failed to send OTP code");
    } finally {
      setModalLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setModalError("Please enter OTP code");
      return;
    }
    setModalError(null);
    setModalLoading(true);
    const purpose = modalType === "set" ? "SET_PASSWORD" : "CHANGE_PASSWORD";
    try {
      await verifyOtp(user.email, otpCode, purpose);
      setIsOtpVerified(true);
    } catch (err) {
      setModalError(err.message || "Invalid OTP code");
    } finally {
      setModalLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setModalError(null);

    if (newPassword !== confirmPassword) {
      setModalError("Passwords do not match");
      return;
    }

    setModalLoading(true);
    try {
      if (modalType === "set") {
        await setPassword(newPassword);
      } else {
        await changePassword(oldPassword, newPassword);
      }
      setModalSuccess(true);
      setTimeout(async () => {
        // Force logout because backend deletes sessions
        try {
          await logoutUser();
        } catch (logoutErr) {
          console.error(logoutErr);
        } finally {
          setUser(null);
          setModalType(null);
          navigate("/login");
        }
      }, 2000);
    } catch (err) {
      setModalError(err.message || "Action failed");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setOtpSent(false);
    setOtpCode("");
    setIsOtpVerified(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setModalError(null);
    setModalSuccess(false);
  };

  const { 
    data: rawReviewsData, 
    isLoading: isLoadingReviews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useMyReviews({
    enabled: !!user,
  });

  const reviews = rawReviewsData?.pages
    ? rawReviewsData.pages.flatMap(page => page?.data?.reviews || page?.reviews || [])
    : [];

  const firstPage = rawReviewsData?.pages?.[0];
  const firstPageData = firstPage?.data || firstPage;
  const averageRating = firstPageData?.averageRating ?? user?.trustScore ?? 0;
  const totalReviews = firstPageData?.totalReviews ?? user?.totalReviews ?? 0;
  const displayedRating = Number(averageRating).toFixed(2);

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

  return (
    <div className="w-full max-w-5xl mx-auto pt-3 sm:pt-6 pb-20 px-1 sm:px-4">
      <div className="mb-5 px-1">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600 mb-2">
          <Sparkles size={12} />
          Your account
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Profile</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Your trust, feedback, and safety guide in one place.</p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5 items-start">
        <div className="space-y-5">
      {/* Profile Details Card */}
          <section className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="h-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-500 relative overflow-hidden">
              <div className="absolute -right-8 -top-14 w-36 h-36 rounded-full border border-white/15"></div>
              <div className="absolute right-8 -top-10 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
            </div>

            <div className="px-6 pb-6 -mt-12 relative">
              <div className="flex items-end justify-between gap-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-slate-100 rounded-3xl overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={`${user?.username || 'User'} avatar`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-500 font-black text-3xl">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
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
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.username || 'User'}</h2>
                <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                  <Mail size={12} />
                  <p className="text-xs font-semibold truncate">{user?.email || 'No email available'}</p>
                </div>
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
                    <span className="font-black text-xl text-slate-900 tracking-tight">{totalReviews}</span>
                  </div>
                  <span className="text-[9px] text-indigo-700/70 font-black uppercase tracking-wider block mt-1">Total reviews</span>
                </div>
              </div>
            </div>
          </section>

          {/* Security Settings Card */}
          <section className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] space-y-4">
            <div className="px-1">
              <h3 className="font-black text-slate-900 text-base tracking-tight">Security</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Manage your account login credentials.</p>
            </div>

            {loadingPassStatus ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin text-indigo-650" size={20} />
              </div>
            ) : passStatus?.isPassAvaillable ? (
              <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-800 text-xs block">Password login active</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Keep your account secure by changing password regularly</span>
                </div>
                <button
                  onClick={() => setModalType('change')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-600/10 shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 space-y-3">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-amber-800 text-xs block">No password set</span>
                  <span className="text-[9px] text-amber-700/85 font-semibold">You are currently logged in with Google. Set a password to enable email & password login.</span>
                </div>
                <button
                  onClick={() => setModalType('set')}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-sm shadow-amber-600/10"
                >
                  Set Password
                </button>
              </div>
            )}
          </section>

          {/* Help & Support Card */}
          <section className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] space-y-3">
            <div className="px-1 mb-4">
              <h3 className="font-black text-slate-900 text-base tracking-tight">Help & Safety</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Quick guidance for safer swaps.</p>
            </div>
        
        {/* Safety Rules Accordion */}
            <div className={`border rounded-2xl overflow-hidden transition-colors ${isSafetyOpen ? 'border-orange-200 bg-orange-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
          <button 
            onClick={() => setIsSafetyOpen(!isSafetyOpen)}
                className="w-full flex justify-between items-center p-4 hover:bg-orange-50/50 transition-colors text-left outline-none cursor-pointer"
                aria-expanded={isSafetyOpen}
          >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                <Shield size={16} />
              </div>
                  <div>
                    <span className="font-extrabold text-slate-800 text-sm block">Safety Rules</span>
                    <span className="text-[9px] text-slate-400 font-semibold">Three essentials before you swap</span>
                  </div>
            </div>
            {isSafetyOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          
          {isSafetyOpen && (
                <div className="px-4 pb-4 pt-1 space-y-4 text-xs font-medium text-slate-500 border-t border-orange-100/60 bg-white">
              <div className="flex items-start space-x-2.5 pt-3">
                <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 text-[10px] font-black mt-0.5 flex-shrink-0">1</div>
                <p className="flex-1 mt-0.5 leading-relaxed">
                  <strong className="text-slate-800 block mb-0.5">Meet in Public Spaces</strong>
                  Always execute swaps in populated, well-lit spaces like shopping centers, stations, or popular cafes.
                </p>
              </div>
              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 text-[10px] font-black mt-0.5 flex-shrink-0">2</div>
                <p className="flex-1 mt-0.5 leading-relaxed">
                  <strong className="text-slate-800 block mb-0.5">Verify First</strong>
                  Do not confirm the swap until you have the physical cash in hand or see the UPI transfer in your bank app.
                </p>
              </div>
              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 text-[10px] font-black mt-0.5 flex-shrink-0">3</div>
                <p className="flex-1 mt-0.5 leading-relaxed">
                  <strong className="text-slate-800 block mb-0.5">Never Share PINs or OTPs</strong>
                  Keep your bank passwords, UPI PINs, and OTPs completely private. No one needs these to swap with you.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* How to Swap Accordion */}
            <div className={`border rounded-2xl overflow-hidden transition-colors ${isHowItWorksOpen ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
          <button 
            onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
                className="w-full flex justify-between items-center p-4 hover:bg-indigo-50/50 transition-colors text-left outline-none cursor-pointer"
                aria-expanded={isHowItWorksOpen}
          >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Info size={16} />
              </div>
                  <div>
                    <span className="font-extrabold text-slate-800 text-sm block">How to Swap</span>
                    <span className="text-[9px] text-slate-400 font-semibold">From request to completed exchange</span>
                  </div>
            </div>
            {isHowItWorksOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          
          {isHowItWorksOpen && (
                <div className="px-4 pb-4 pt-1 space-y-4 text-xs font-medium text-slate-500 border-t border-indigo-100/60 bg-white">
              <div className="flex items-start space-x-2.5 pt-3">
                <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 text-[10px] font-black mt-0.5 flex-shrink-0">1</div>
                <p className="flex-1 mt-0.5 leading-relaxed">
                  <strong className="text-slate-800 block mb-0.5">Ask for Cash or UPI</strong>
                  Choose what you need (Cash or UPI), enter the amount, and post your request.
                </p>
              </div>
              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 text-[10px] font-black mt-0.5 flex-shrink-0">2</div>
                <p className="flex-1 mt-0.5 leading-relaxed">
                  <strong className="text-slate-800 block mb-0.5">Get an Offer</strong>
                  A helper nearby will offer to help. You choose whether to accept their offer.
                </p>
              </div>
              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 text-[10px] font-black mt-0.5 flex-shrink-0">3</div>
                <p className="flex-1 mt-0.5 leading-relaxed">
                  <strong className="text-slate-800 block mb-0.5">Chat & Meet Up</strong>
                  Chat safely inside the app to coordinate a public meeting spot.
                </p>
              </div>
              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 text-[10px] font-black mt-0.5 flex-shrink-0">4</div>
                <p className="flex-1 mt-0.5 leading-relaxed">
                  <strong className="text-slate-800 block mb-0.5">Swap & Finish</strong>
                  Meet up, exchange cash/UPI, and both tap 'Mark Done' to finish.
                </p>
              </div>
            </div>
          )}
            
            {/* My Submitted Reports Accordion */}
            <div className={`border rounded-2xl overflow-hidden transition-colors mt-3 ${isReportsOpen ? 'border-rose-200 bg-rose-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
              <button 
                onClick={() => setIsReportsOpen(!isReportsOpen)}
                className="w-full flex justify-between items-center p-4 hover:bg-rose-50/50 transition-colors text-left outline-none cursor-pointer"
                aria-expanded={isReportsOpen}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-800 text-sm block">Submitted Reports</span>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      {loadingReports ? 'Checking...' : reports.length === 1 ? '1 report filed' : `${reports.length} reports filed`}
                    </span>
                  </div>
                </div>
                {isReportsOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>
              
              {isReportsOpen && (
                <div className="px-4 pb-4 pt-1 space-y-3 font-medium border-t border-rose-100/60 bg-white max-h-72 overflow-y-auto">
                  {loadingReports ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="animate-spin text-rose-600" size={20} />
                    </div>
                  ) : reportsError ? (
                    <p className="text-xs text-rose-500 font-semibold text-center py-4">{reportsError}</p>
                  ) : reports.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-slate-400 font-semibold">You have not submitted any reports.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-3">
                      {reports.map((report) => {
                        const reportedUser = report.reportedUser;
                        const statusColors = {
                          OPEN: 'bg-amber-50 text-amber-700 border-amber-100/70',
                          UNDER_REVIEW: 'bg-indigo-50 text-indigo-700 border-indigo-100/70',
                          RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-100/70',
                          REJECTED: 'bg-rose-50 text-rose-700 border-rose-100/70'
                        };
                        const statusLabels = {
                          OPEN: 'Open',
                          UNDER_REVIEW: 'Under Review',
                          RESOLVED: 'Resolved',
                          REJECTED: 'Rejected'
                        };
                        const reasonLabels = {
                          SPAM: 'Spam or Advertising',
                          FAKE_PROFILE: 'Fake Profile / Impersonator',
                          HARASSMENT: 'Harassment or Abuse',
                          SCAM_ATTEMPT: 'Scam or Fraudulent Attempt',
                          USER_DID_NOT_SHOW_UP: 'Partner Did Not Show Up',
                          FAKE_CASH: 'Fake / Counterfeit Cash',
                          FAKE_PAYMENT_PROOF: 'Fake UPI Payment Proof',
                          INAPPROPRIATE_BEHAVIOR: 'Inappropriate Behavior',
                          OTHER: 'Other Reason'
                        };

                        return (
                          <div 
                            key={report._id} 
                            className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-2.5"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200 shadow-sm">
                                  {reportedUser?.avatar ? (
                                    <img src={reportedUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    reportedUser?.username?.charAt(0).toUpperCase() || '?'
                                  )}
                                </div>
                                <div>
                                  <span className="text-xs font-extrabold text-slate-800 block leading-tight">
                                    {reportedUser?.username || 'Reported User'}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-semibold leading-none">
                                    {new Date(report.createdAt).toLocaleDateString('en-IN', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </div>
                              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-full ${
                                statusColors[report.status] || 'bg-slate-50 text-slate-600 border-slate-100'
                              }`}>
                                {statusLabels[report.status] || report.status}
                              </span>
                            </div>

                            <div className="text-[10px] space-y-1">
                              <p className="text-slate-550 font-semibold">
                                <strong className="text-slate-700 font-extrabold uppercase text-[9px] tracking-wider block">Reason</strong>
                                {reasonLabels[report.reason] || report.reason}
                              </p>
                              {report.description && (
                                <p className="text-slate-600 italic bg-white border border-slate-100 rounded-lg p-2 font-medium mt-1 leading-relaxed">
                                  "{report.description}"
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            </div>
          </section>
        </div>

      {/* Reviews Received Card */}
        <section className="bg-white border border-slate-100 rounded-[2rem] p-5 sm:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] min-h-[340px]">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="font-black text-slate-900 text-lg tracking-tight">Reviews</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Feedback from your completed swaps.</p>
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
        ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-indigo-500 mb-3">
                <MessageSquareQuote size={21} />
              </div>
              <h4 className="text-sm font-extrabold text-slate-700">No reviews yet</h4>
              <p className="text-[10px] text-slate-400 font-semibold max-w-xs mt-1.5 leading-relaxed">Reviews will appear here after your completed swaps.</p>
            </div>
        ) : (
            <div className="space-y-3 max-h-[570px] overflow-y-auto pr-1">
            {reviews.map((review) => (
                <article key={review._id} className="bg-gradient-to-br from-white to-slate-50/70 border border-slate-200/70 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200 hover:border-indigo-100 hover:shadow-[0_6px_20px_rgba(99,102,241,0.05)] transition-all">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                      {review.reviewer?.avatar ? (
                          <img src={review.reviewer.avatar} alt={`${review.reviewer?.username || 'Reviewer'} avatar`} className="w-full h-full object-cover" />
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
                      <span className="text-[10px] font-black text-amber-700">{Number(review.rating || 0).toFixed(2)}</span>
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
                <Loader2 className="animate-spin text-indigo-600" size={20} />
              </div>
            )}
          </div>
        )}
        </section>
      </div>

      {/* Password Management Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_32px_100px_rgba(15,23,42,0.12)] border border-slate-100 flex flex-col justify-center animate-in zoom-in-95 duration-200 select-none">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Icon & Title */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-650 mx-auto mb-3 shadow-sm">
                <Lock size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {modalType === 'set' ? 'Set Account Password' : 'Change Password'}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                {!otpSent && "We need to verify your email address before setting your password."}
                {otpSent && !isOtpVerified && `Enter the 6-digit code sent to ${user?.email}`}
                {isOtpVerified && (modalType === 'set' ? "Enter your new password below." : "Enter your old and new passwords.")}
              </p>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="mb-4 p-3.5 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-2">
                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px]">
                  !
                </span>
                <span>{modalError}</span>
              </div>
            )}

            {/* Step 1: Send OTP */}
            {!otpSent && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 font-medium leading-relaxed">
                  We will send a verification code to <strong className="text-slate-800">{user?.email}</strong>.
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={modalLoading}
                  className="w-full py-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/15 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center"
                >
                  {modalLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : "Send Code"}
                </button>
              </div>
            )}

            {/* Step 2: Verify OTP */}
            {otpSent && !isOtpVerified && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <KeyRound size={16} />
                    </div>
                    <input
                      type="number"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 tracking-widest placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={modalLoading}
                  className="w-full py-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/15 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center"
                >
                  {modalLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : "Verify Code"}
                </button>

                <div className="text-center">
                  {cooldown > 0 ? (
                    <span className="text-xs font-semibold text-slate-400">
                      Resend code in {cooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs font-black text-indigo-650 hover:text-indigo-700 cursor-pointer"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Enter Password Details */}
            {isOtpVerified && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {modalSuccess ? (
                  <div className="text-center py-6 space-y-3 animate-in fade-in duration-300">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="text-sm font-black text-slate-800">Password Updated!</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Please log in again with your password.</p>
                  </div>
                ) : (
                  <>
                    {modalType === 'change' && (
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Old Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Lock size={16} />
                          </div>
                          <input
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter old password"
                            className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                          >
                            {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock size={16} />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock size={16} />
                        </div>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="w-full py-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/15 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center"
                    >
                      {modalLoading ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        modalType === 'set' ? "Set Password" : "Update Password"
                      )}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
