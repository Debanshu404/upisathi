import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Plus,
  ChevronRight,
  Smartphone,
  Banknote,
  ArrowLeftRight,
  FileText,
  Users,
  CheckCircle,
  MapPin,
  Shield,
  Info,
  Star,
  MessageSquare,
  X,
  Loader2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMyRequests, usePublicRequests, useCancelRequest } from '../hooks/useExchanges';
import { usePendingMatches, useActiveMatches, useConfirmMatch, useRejectMatch, useCompleteMatch, useCancelActiveMatch, useCompletedCounter } from '../hooks/useMatches';
import { userContext } from '../context/UserContext';
import { socketContext } from '../context/SocketContext';
import { locationContext } from '../context/LocationContext';
import { calculateDistance } from '../utils/geo';
import LocationMap from '../components/LocationMap';
import NearbySwapsMap from '../components/NearbySwapsMap';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const { socket, isOnline } = useContext(socketContext);
  const { currentLocation } = useContext(locationContext);
  const queryClient = useQueryClient();

  // Keep track of current location to use in socket event handlers without re-subscriptions
  const currentLocationRef = useRef(currentLocation);
  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  // React Query queries
  const { data: rawMyRequests, isLoading: loadingMyRequests } = useMyRequests({ enabled: !!user });
  const { data: rawPendingMatches, isLoading: loadingPendingMatches } = usePendingMatches({ enabled: !!user });
  const { data: rawActiveMatches, isLoading: loadingActiveMatches } = useActiveMatches({ enabled: !!user });
  const { data: rawCompletedCount, isLoading: loadingCompletedCount } = useCompletedCounter({ enabled: !!user });

  const completedCount = rawCompletedCount?.data?.counter ?? rawCompletedCount?.counter ?? 0;

  const myRequests = rawMyRequests?.pages
    ? rawMyRequests.pages.flatMap(page => page?.data?.requests || page?.requests || [])
    : (Array.isArray(rawMyRequests?.data)
      ? rawMyRequests.data
      : (Array.isArray(rawMyRequests) ? rawMyRequests : []));

  const pendingMatches = Array.isArray(rawPendingMatches?.data)
    ? rawPendingMatches.data
    : (Array.isArray(rawPendingMatches) ? rawPendingMatches : []);

  const activeExchanges = Array.isArray(rawActiveMatches?.data)
    ? rawActiveMatches.data
    : (Array.isArray(rawActiveMatches) ? rawActiveMatches : []);

  // Track matched request IDs to block cancellation
  const matchedRequestIds = new Set();
  pendingMatches.forEach(m => {
    if (m.request) matchedRequestIds.add(m.request._id || m.request);
  });
  activeExchanges.forEach(m => {
    if (m.request) matchedRequestIds.add(m.request._id || m.request);
  });

  const activeRequests = myRequests.filter(r => r.status === 'ACTIVE' && !r.expired);
  activeRequests.forEach(r => {
    r.hasMatch = matchedRequestIds.has(r._id);
  });

  // Determine if user has active or matched requests
  const incompleteExchanges = activeExchanges.filter(m => {
    const isRequester = m.requester?._id === user?._id || m.requester === user?._id;
    const hasCompleted = isRequester ? m.requesterCompleted : m.accepterCompleted;
    return !hasCompleted;
  });

  const hasActiveOrMatched = activeRequests.length > 0 || incompleteExchanges.length > 0;

  const isLoading = loadingMyRequests || loadingPendingMatches || loadingActiveMatches || loadingCompletedCount;

  // Fetch public requests within radius to count them
  const { data: rawPublicRequests } = usePublicRequests(
    currentLocation?.longitude,
    currentLocation?.latitude,
    10,
    { enabled: !!currentLocation }
  );

  const publicRequests = Array.isArray(rawPublicRequests?.data)
    ? rawPublicRequests.data
    : (Array.isArray(rawPublicRequests) ? rawPublicRequests : []);

  // Calculate distances and sort public requests to get the closest ones
  const topRequests = publicRequests
    .map(req => {
      const distance = currentLocation && req.location?.coordinates
        ? calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          req.location.coordinates[1],
          req.location.coordinates[0]
        )
        : 999;
      return { ...req, distance };
    })
    .sort((a, b) => a.distance - b.distance);

  const [newRequestIds, setNewRequestIds] = useState([]);
  const newRequestsCount = newRequestIds.length;

  useEffect(() => {
    if (Array.isArray(publicRequests)) {
      const ids = publicRequests.map(r => r._id);
      setNewRequestIds(prev => {
        if (prev.length === ids.length && prev.every((id, idx) => id === ids[idx])) {
          return prev;
        }
        return ids;
      });
    }
  }, [rawPublicRequests]);

  // Keep track of active requests to use in socket event handlers without re-subscriptions
  const activeRequestsRef = useRef(activeRequests);
  useEffect(() => {
    activeRequestsRef.current = activeRequests;
  }, [activeRequests]);

  // Interactive creation banner state
  const [sendType, setSendType] = useState('UPI');
  const [statusText, setStatusText] = useState("Sharing your request nearby...");

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'safety' | 'howItWorks' | 'myRequests' | 'peopleInterested' | 'exchangesCompleted' | null
  const [showMapForMatchId, setShowMapForMatchId] = useState(null);

  // Loading states for actions
  const [completingExchangeId, setCompletingExchangeId] = useState(null);
  const [cancellingExchangeId, setCancellingExchangeId] = useState(null);
  const [actionInProgressId, setActionInProgressId] = useState(null);

  const [completedSwapForReview, setCompletedSwapForReview] = useState(null);
  const [reportMatchId, setReportMatchId] = useState(null);
  const [reportPartner, setReportPartner] = useState(null);

  const exchangeDetailsRef = useRef([]);

  // Mutations
  const cancelRequestMutation = useCancelRequest();
  const confirmMatchMutation = useConfirmMatch();
  const rejectMatchMutation = useRejectMatch();
  const completeMatchMutation = useCompleteMatch();
  const cancelActiveMatchMutation = useCancelActiveMatch();

  // Realtime Socket listener for own user events (refreshes stats)
  useEffect(() => {
    if (!socket?.current) return;

    const triggerRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingMatches'] });
      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
      queryClient.invalidateQueries({ queryKey: ['completedCounter'] });
    };

    const events = [
      'newMatch',
      'confirmMatch',
      'rejectMatch',
      'cancelActiveMatch',
      'newMessage'
    ];

    events.forEach(evt => socket.current.on(evt, triggerRefresh));

    const handleCompleteMatchEvent = (data) => {
      if (data?.completedCount === 2) {
        // Find if this matches one of our active exchanges
        const matchedExchange = exchangeDetailsRef.current?.find(e => e.matchId === data.matchId);
        if (matchedExchange) {
          // Trigger the review modal for this partner ONLY if we haven't reviewed yet
          if (!matchedExchange.hasReviewed) {
            setCompletedSwapForReview({
              matchId: matchedExchange.matchId,
              otherUser: matchedExchange.otherUser
            });
          }
        }
      }
      triggerRefresh();
    };

    socket.current.on('completeMatch', handleCompleteMatchEvent);

    return () => {
      events.forEach(evt => socket.current.off(evt, triggerRefresh));
      if (socket.current) {
        socket.current.off('completeMatch', handleCompleteMatchEvent);
      }
    };
  }, [socket, queryClient, isOnline]);

  // Realtime Socket listener for new public requests (increments local new counter if within search range)
  useEffect(() => {
    if (!socket?.current) return;

    const handleNewRequest = (data) => {
      console.log("Home Socket: newRequest received", data);
      const request = data.request;
      if (!request) return;
      const creatorId = request.creator?._id || request.creator;
      if (creatorId) {
        if (creatorId !== user?._id) {
          // Invalidate public requests unconditionally for other users' requests so the map/list update
          queryClient.invalidateQueries({ queryKey: ['publicRequests'] });

          if (currentLocationRef.current && request.location?.coordinates) {
            const distance = calculateDistance(
              currentLocationRef.current.latitude,
              currentLocationRef.current.longitude,
              request.location.coordinates[1], // latitude
              request.location.coordinates[0]  // longitude
            );
            if (distance <= 10) {
              setNewRequestIds(prev => prev.includes(request._id) ? prev : [...prev, request._id]);
            }
          }
        } else {
          // If our own request was created on another device/tab, refresh dashboard data
          queryClient.invalidateQueries({ queryKey: ['myRequests'] });
        }
      }
    };

    const handleRequestCancelled = (data) => {
      console.log("Home Socket: requestCancelled received", data);
      const cancelledId = data?.requestId;
      if (cancelledId) {
        setNewRequestIds(prev => prev.filter(id => id !== cancelledId));
        queryClient.invalidateQueries({ queryKey: ['publicRequests'] });
        const isMyRequest = activeRequestsRef.current.some(r => r._id === cancelledId);
        if (isMyRequest) {
          queryClient.invalidateQueries({ queryKey: ['myRequests'] });
        }
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
  }, [socket, user, queryClient, isOnline]);

  // Radar scanning cycler
  useEffect(() => {
    if (activeRequests.length === 0 || pendingMatches.length > 0 || incompleteExchanges.length > 0) return;
    const statuses = [
      "Sharing your request nearby...",
      "Searching in 5km radius...",
      "Notifying nearby helpers...",
      "Optimizing response pool...",
      "Waiting for offers..."
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % statuses.length;
      setStatusText(statuses[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeRequests, pendingMatches, incompleteExchanges]);

  const handleSwapSelection = () => {
    setSendType(prev => prev === 'UPI' ? 'Cash' : 'UPI');
  };



  const handleCreateRequestRedirect = () => {
    if (hasActiveOrMatched) return;
    const typeValue = sendType === 'UPI' ? 'NEED_CASH' : 'NEED_UPI';
    navigate('/create-request', { state: { type: typeValue } });
  };

  // --- Actions ---
  const handleCancelRequest = async (requestId) => {
    setActionInProgressId(requestId);
    try {
      await cancelRequestMutation.mutateAsync(requestId);
    } catch (err) {
      console.error('Error cancelling request:', err);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleAcceptMatch = async (matchId) => {
    setActionInProgressId(matchId);
    try {
      await confirmMatchMutation.mutateAsync(matchId);
      navigate(`/chat/${matchId}`);
    } catch (err) {
      console.error('Error accepting match:', err);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleDeclineMatch = async (matchId) => {
    setActionInProgressId(matchId);
    try {
      await rejectMatchMutation.mutateAsync(matchId);
    } catch (err) {
      console.error('Error declining match:', err);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleCompleteExchangeMatch = async (matchId) => {
    setCompletingExchangeId(matchId);
    try {
      await completeMatchMutation.mutateAsync(matchId);
    } catch (err) {
      console.error('Error completing match:', err);
    } finally {
      setCompletingExchangeId(null);
    }
  };

  const handleCancelExchangeMatch = async (matchId) => {
    setCancellingExchangeId(matchId);
    try {
      await cancelActiveMatchMutation.mutateAsync(matchId);
    } catch (err) {
      console.error('Error cancelling match:', err);
    } finally {
      setCancellingExchangeId(null);
    }
  };

  // Determine active exchange display variables (including those completed by us for socket ref)
  const allActiveExchangesDetails = activeExchanges.map(activeExchange => {
    const isRequester = activeExchange.requester?._id === user?._id || activeExchange.requester === user?._id;
    const otherUser = isRequester ? activeExchange.accepter : activeExchange.requester;
    const requestType = activeExchange.request?.type;
    const amount = activeExchange.request?.amount || 0;

    const sendMethod = isRequester
      ? (requestType === 'NEED_CASH' ? 'UPI' : 'Cash')
      : (requestType === 'NEED_CASH' ? 'Cash' : 'UPI');

    const receiveMethod = isRequester
      ? (requestType === 'NEED_CASH' ? 'Cash' : 'UPI')
      : (requestType === 'NEED_CASH' ? 'UPI' : 'Cash');

    return {
      matchId: activeExchange._id,
      otherUser,
      sendMethod,
      receiveMethod,
      amount,
      location: activeExchange.meetUpLocation || activeExchange.request?.note || 'Meetup details in chat',
      time: new Date(activeExchange.createdAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      hasCompleted: isRequester ? activeExchange.requesterCompleted : activeExchange.accepterCompleted,
      hasReviewed: isRequester ? activeExchange.requesterReviewed : activeExchange.accepterReviewed,
      waitingForOther: isRequester ? !activeExchange.accepterCompleted : !activeExchange.requesterCompleted,
      unreadCount: isRequester ? (activeExchange.requesterUnread || 0) : (activeExchange.accepterUnread || 0),
      rawExchange: activeExchange
    };
  });

  // Only render active exchanges that are NOT completed by the current user
  const activeExchangesDetails = allActiveExchangesDetails.filter(d => !d.hasCompleted);

  // Keep the exchangeDetailsRef updated for use in socket event listeners (includes completed ones)
  useEffect(() => {
    exchangeDetailsRef.current = allActiveExchangesDetails;
  }, [allActiveExchangesDetails]);

  return (
    <div className="flex flex-col h-full max-w-md md:max-w-5xl mx-auto pt-2 pb-20 md:pb-10 space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-8 items-start">

      {/* Left Column: Hero State Card System */}
      <div className="w-full md:col-span-7">
        {(() => {
          const showOngoing = activeExchangesDetails.length > 0;
          const showRequest = activeRequests.length > 0;

          if (showOngoing || showRequest) {
            return (
              <div className="space-y-6 w-full animate-in fade-in duration-200">
                {/* Render ongoing swaps if any */}
                {activeExchangesDetails.map((exchangeDetails) => {
                  const matchId = exchangeDetails.matchId;
                  const isCompleting = completingExchangeId === matchId;
                  const isCancelling = cancellingExchangeId === matchId;
                  const showMap = showMapForMatchId === matchId;
                  return (
                    <div key={matchId} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4 transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Your Ongoing Swap</h3>
                          <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100/50 px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                            Ongoing
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center gap-4 bg-slate-50/50 border border-slate-100/60 rounded-2xl p-4">
                        <div className="flex-1 flex flex-col items-center">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">You Send ({exchangeDetails.sendMethod})</span>
                          <span className="text-xl font-black text-emerald-600 mt-1 tracking-tight">₹{exchangeDetails.amount}</span>
                        </div>

                        <div className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                          <ArrowLeftRight size={14} className="text-slate-400" />
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">You Receive ({exchangeDetails.receiveMethod})</span>
                          <span className="text-xl font-black text-indigo-600 mt-1 tracking-tight">₹{exchangeDetails.amount}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-3">
                        <Link to={`/profile/${exchangeDetails.otherUser?._id}`} className="flex items-center space-x-3 hover:opacity-85 transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            {exchangeDetails.otherUser?.avatar ? (
                              <img src={exchangeDetails.otherUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                {exchangeDetails.otherUser?.username?.charAt(0).toUpperCase() || '?'}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{exchangeDetails.otherUser?.username}</h4>
                            <div className="flex items-center text-xs text-amber-500 font-bold mt-0.5">
                              <Star size={12} className="fill-amber-400 text-amber-400 mr-0.5" />
                              <span>{exchangeDetails.otherUser?.trustScore || '4.8'}</span>
                            </div>
                          </div>
                        </Link>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setReportMatchId(exchangeDetails.matchId);
                              setReportPartner(exchangeDetails.otherUser);
                            }}
                            className="flex items-center justify-center p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 duration-200 border border-rose-100/50 cursor-pointer"
                            title="Report Swap Partner"
                          >
                            <AlertCircle size={16} />
                          </button>

                          <button
                            onClick={() => navigate(`/chat/${exchangeDetails.matchId}`)}
                            className="flex items-center justify-center p-3 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-xl font-bold transition-all relative hover:scale-105 active:scale-95 duration-200"
                            title="Open Chat"
                          >
                            <MessageSquare size={16} className="fill-violet-600/10" />
                            {exchangeDetails.unreadCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                                {exchangeDetails.unreadCount}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => handleCancelExchangeMatch(exchangeDetails.matchId)}
                            disabled={isCancelling || isCompleting || exchangeDetails.hasCompleted}
                            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 text-xs border border-slate-200"
                          >
                            {isCancelling ? <Loader2 className="animate-spin" size={14} /> : 'Cancel Swap'}
                          </button>

                          {exchangeDetails.hasCompleted ? (
                            exchangeDetails.hasReviewed ? (
                              <span className="px-3.5 py-2 text-slate-400 bg-slate-50 border border-slate-200/50 rounded-xl font-bold text-center text-xs flex items-center justify-center">
                                Reviewed ✓
                              </span>
                            ) : (
                              <button
                                onClick={() => setCompletedSwapForReview({
                                  matchId: exchangeDetails.matchId,
                                  otherUser: exchangeDetails.otherUser
                                })}
                                className="px-3.5 py-2 bg-indigo-50 text-indigo-650 hover:bg-indigo-100 rounded-xl border border-indigo-100/35 transition-all text-xs font-bold active:scale-95 cursor-pointer flex items-center justify-center hover:scale-105"
                              >
                                Rate Partner
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => handleCompleteExchangeMatch(exchangeDetails.matchId)}
                              disabled={isCancelling || isCompleting}
                              className="px-3.5 py-2 text-white font-extrabold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 bg-indigo-600 hover:from-indigo-700 hover:to-indigo-600 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all active:scale-95 text-xs flex items-center justify-center"
                            >
                              {isCompleting ? <Loader2 className="animate-spin" size={14} /> : 'Mark Done'}
                            </button>
                          )}
                        </div>
                      </div>

                      {exchangeDetails.hasCompleted && exchangeDetails.waitingForOther && (
                        <p className="text-[10px] text-center text-slate-400 font-medium mt-1 animate-pulse">Waiting for partner's confirmation...</p>
                      )}

                      <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-955 font-semibold mt-1">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <MapPin size={14} className="text-indigo-500 flex-shrink-0" />
                          <span className="truncate text-indigo-900">{exchangeDetails.location}</span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full mx-2 flex-shrink-0"></div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <span className="text-indigo-600 font-bold">{exchangeDetails.time}</span>
                        </div>
                      </div>

                      {/* Show Map Toggle for Ongoing Swap */}
                      {currentLocation && exchangeDetails.rawExchange.request?.location?.coordinates && (
                        <div className="pt-1">
                          <button
                            onClick={() => setShowMapForMatchId(prev => prev === matchId ? null : matchId)}
                            className="flex items-center space-x-1.5 text-[10px] font-extrabold text-indigo-650 bg-indigo-50/50 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100/30 transition-all active:scale-95 cursor-pointer"
                          >
                            <MapPin size={11} className="text-indigo-600" />
                            <span>{showMap ? "Hide Map" : "View Map"}</span>
                          </button>
                          {showMap && (
                            <div className="mt-2 animate-in fade-in zoom-in-95 duration-200">
                              <LocationMap userLocation={currentLocation} requestLocation={exchangeDetails.rawExchange.request.location.coordinates} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Render active request status if any */}
                {showRequest && (() => {
                  if (pendingMatches.length > 0) {
                    return (
                      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-50/70 blur-2xl pointer-events-none"></div>

                        <div className="relative flex flex-col items-center text-center">
                          <div className="relative mb-3 mt-1">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                              <CheckCircle size={25} className="text-emerald-500" strokeWidth={2.5} />
                            </div>
                            <span className="absolute -right-1.5 -top-1.5 min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center ring-4 ring-white">
                              {pendingMatches.length}
                            </span>
                          </div>

                          <h2 className="text-lg font-black text-slate-900 tracking-tight">
                            {pendingMatches.length === 1 ? 'You received an offer' : `${pendingMatches.length} offers are waiting`}
                          </h2>
                          <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm">
                            {pendingMatches.length === 1
                              ? 'Review the helper and accept when you are ready.'
                              : 'Compare the helpers below and choose who you want to swap with.'}
                          </p>
                        </div>

                        <div className="relative space-y-3 max-h-[260px] overflow-y-auto pr-1 mt-5">
                          {pendingMatches.map((match) => {
                            const accepter = match.accepter;
                            return (
                              <div
                                key={match._id}
                                className="group bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:border-emerald-200 hover:shadow-[0_8px_24px_rgba(16,185,129,0.08)] transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <Link to={`/profile/${accepter?._id}`} className="flex items-center gap-3 min-w-0 hover:opacity-85 transition-opacity">
                                    <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden border-2 border-white ring-1 ring-slate-200 flex-shrink-0 shadow-sm">
                                      {accepter?.avatar ? (
                                        <img src={accepter.avatar} alt={`${accepter?.username || 'Helper'} avatar`} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                                          {accepter?.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0 text-left">
                                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight truncate">
                                        {accepter?.username || 'Nearby helper'}
                                      </h4>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
                                          <Star size={10} className="fill-amber-400 text-amber-400" />
                                          {Number(accepter?.trustScore ?? 4.8).toFixed(2)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-semibold">Trusted helper</span>
                                      </div>
                                    </div>
                                  </Link>
                                  <div className="text-right pl-3 flex-shrink-0">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Swap amount</span>
                                    <span className="text-lg leading-none font-black text-indigo-600 block">₹{match.request?.amount}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.35fr)] gap-2.5 border-t border-slate-100 pt-3 mt-3">
                                  <button
                                    onClick={() => handleDeclineMatch(match._id)}
                                    disabled={actionInProgressId !== null}
                                    className="min-w-0 h-10 px-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all text-xs disabled:opacity-50 flex items-center justify-center cursor-pointer"
                                  >
                                    {actionInProgressId === match._id ? <Loader2 className="animate-spin" size={12} /> : 'Decline'}
                                  </button>
                                  <button
                                    onClick={() => handleAcceptMatch(match._id)}
                                    disabled={actionInProgressId !== null}
                                    className="min-w-0 h-10 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold rounded-xl hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] transition-all text-xs shadow-md shadow-emerald-500/15 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    {actionInProgressId === match._id ? (
                                      <Loader2 className="animate-spin" size={14} />
                                    ) : (
                                      <>
                                        <MessageSquare size={13} />
                                        <span>Accept & Chat</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } else {
                    const firstReq = activeRequests[0];
                    return (
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>

                        <h2 className="text-lg font-extrabold text-slate-800 mt-2 tracking-tight">Looking for Helpers...</h2>

                        <div className="relative w-32 h-32 flex items-center justify-center bg-gradient-to-b from-indigo-50/40 to-slate-50/10 rounded-full border border-indigo-100/50 shadow-[inset_0_2px_8px_rgba(99,102,241,0.04)] overflow-hidden mx-auto my-5">
                          <div className="absolute inset-2 border border-indigo-100/30 rounded-full"></div>
                          <div className="absolute inset-6 border border-indigo-100/20 rounded-full"></div>
                          <div className="absolute inset-12 border border-indigo-100/10 rounded-full animate-pulse"></div>

                          {/* Ping rings */}
                          <div className="absolute w-24 h-24 bg-indigo-500/5 border border-indigo-500/15 rounded-full animate-ping" style={{ animationDuration: '2.5s' }}></div>
                          <div className="absolute w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>

                          {/* Crosshairs */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-[0.12] pointer-events-none">
                            <div className="w-full h-[1px] bg-indigo-400"></div>
                            <div className="h-full w-[1px] bg-indigo-400"></div>
                          </div>

                          {/* Sonar sweep beam */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent rounded-full animate-spin pointer-events-none" style={{ animationDuration: '3.5s' }}></div>

                          {/* Center dot */}
                          <div className="relative w-9 h-9 bg-gradient-to-tr from-indigo-600 to-indigo-500 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 border-2 border-white">
                            <Loader2 className="animate-spin text-white" size={14} />
                          </div>
                        </div>

                        <div className="space-y-1 px-4 mb-4">
                          <p className="text-xs font-bold text-indigo-600 h-5 flex items-center justify-center tracking-wide">
                            {statusText}
                          </p>
                          <p className="text-[11px] text-slate-400 font-semibold">
                            We are broadcasting your request to helpers nearby.
                          </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex justify-between items-center text-left text-xs mb-4">
                          <div>
                            <span className="font-extrabold text-slate-800">
                              {firstReq?.type === 'NEED_CASH' ? 'Need Cash (Will Pay UPI)' : 'Need UPI (Will Pay Cash)'}
                            </span>
                            <div className="text-[10px] text-slate-400 font-bold mt-1 space-y-0.5">
                              {firstReq?.note && <p className="truncate max-w-[200px]">Note: {firstReq?.note}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-black text-indigo-600">₹{firstReq?.amount}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCancelRequest(firstReq?._id)}
                          disabled={actionInProgressId === firstReq?._id}
                          className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer active:scale-98"
                        >
                          {actionInProgressId === firstReq?._id ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <span>Cancel Search</span>
                          )}
                        </button>
                      </div>
                    );
                  }
                })()}
              </div>
            );
          }

          // State 1: No Request (Default)
          return (
            <div className="space-y-6">
              {/* Need Cash or UPI? Creator Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Need Cash or UPI?</h2>
                    <p className="text-xs text-slate-400 font-semibold max-w-[220px] leading-relaxed">
                      Set your amount and meet up with a helper near you.
                    </p>
                  </div>
                  <button
                    onClick={handleCreateRequestRedirect}
                    disabled={hasActiveOrMatched}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-sm transition-all duration-300 ${hasActiveOrMatched
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-tr from-indigo-600 to-violet-650 bg-indigo-600 hover:from-indigo-700 hover:to-violet-750 text-white shadow-indigo-600/10 shadow-md hover:shadow-indigo-600/20 active:scale-95 cursor-pointer'
                      }`}
                    title={hasActiveOrMatched ? "You already have a live request or swap" : "Ask for Cash/UPI"}
                  >
                    <Plus size={14} className="stroke-[3]" />
                    <span>Ask for Cash/UPI</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-50/70 border border-slate-100/80 rounded-2xl p-4 mt-2 relative overflow-hidden">
                  <div className="flex-1 flex flex-col items-center p-2 rounded-xl transition-all duration-300">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">You Send</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {sendType === 'UPI' ? (
                        <>
                          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                            <Smartphone className="stroke-[2.5]" size={16} />
                          </div>
                          <span className="text-base font-extrabold text-slate-800">UPI</span>
                        </>
                      ) : (
                        <>
                          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <Banknote className="stroke-[2.5]" size={16} />
                          </div>
                          <span className="text-base font-extrabold text-slate-800">Cash</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSwapSelection}
                    className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all duration-300 mx-3 cursor-pointer"
                  >
                    <ArrowLeftRight size={16} className={`text-slate-500 transition-transform duration-500 ${sendType === 'UPI' ? 'rotate-0' : 'rotate-180'}`} />
                  </button>

                  <div className="flex-1 flex flex-col items-center p-2 rounded-xl transition-all duration-300">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">You Receive</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {sendType === 'UPI' ? (
                        <>
                          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <Banknote className="stroke-[2.5]" size={16} />
                          </div>
                          <span className="text-base font-extrabold text-slate-800">Cash</span>
                        </>
                      ) : (
                        <>
                          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                            <Smartphone className="stroke-[2.5]" size={16} />
                          </div>
                          <span className="text-base font-extrabold text-slate-800">UPI</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Nearby Swaps Map & List Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] space-y-4 overflow-hidden">
                <div className="flex justify-between items-start gap-4 px-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-sm tracking-tight">Nearby Live Requests</h3>
                      {topRequests.length > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black flex items-center justify-center">
                          {topRequests.length > 99 ? '99+' : topRequests.length}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Sorted by distance from your location</p>
                  </div>
                  <Link
                    to="/find-requests"
                    className="h-8 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-[10px] font-extrabold text-indigo-700 transition-colors flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Explore all</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>

                {currentLocation && (
                  <NearbySwapsMap
                    userLocation={currentLocation}
                    requests={publicRequests}
                    onSelectRequest={() => navigate('/find-requests')}
                  />
                )}

                <div className="relative">
                  {topRequests.length > 0 ? (
                    <>
                      <div className="space-y-2 max-h-[280px] overflow-y-auto overscroll-contain pr-1 pb-1">
                        {topRequests.map((req) => {
                          const isCash = req.type === 'NEED_CASH';
                          return (
                            <button
                              type="button"
                              key={req._id}
                              onClick={() => navigate('/find-requests')}
                              className="w-full p-3 bg-slate-50/70 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-[0_5px_18px_rgba(99,102,241,0.06)] transition-all duration-200 cursor-pointer text-left group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative flex-shrink-0">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-slate-500 font-extrabold text-xs shadow-sm">
                                    {req.creator?.avatar ? (
                                      <img src={req.creator.avatar} alt={`${req.creator?.username || 'User'} avatar`} className="w-full h-full object-cover" />
                                    ) : (
                                      <span>{req.creator?.username?.charAt(0).toUpperCase() || '?'}</span>
                                    )}
                                  </div>
                                  <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-1.5">
                                    <h4 className="font-extrabold text-slate-800 text-xs truncate leading-tight">
                                      {req.creator?.username || 'Nearby user'}
                                    </h4>
                                    {req.creator?.trustScore !== undefined && (
                                      <span className="inline-flex items-center gap-0.5 text-[8px] text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded-full px-1">
                                        <Star size={8} className="fill-amber-400 text-amber-400" />
                                        {Number(req.creator.trustScore).toFixed(1)}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-bold block mt-1">
                                    {req.distance < 999 ? `${req.distance.toFixed(1)} km away` : 'Distance unavailable'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="text-right">
                                  <span className="text-xs font-black text-slate-900 block">₹{req.amount}</span>
                                  <span className={`text-[8px] font-black uppercase block mt-0.5 ${isCash ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                    Needs {isCash ? 'Cash' : 'UPI'}
                                  </span>
                                </div>
                                <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                                  <ChevronRight size={14} />
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {topRequests.length > 4 && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent rounded-b-2xl"></div>
                      )}
                    </>
                  ) : (
                    <div className="p-6 text-center bg-slate-50/50 border border-slate-200 border-dashed rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-indigo-500 mx-auto mb-3">
                        <Search size={18} />
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-700">No nearby requests yet</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">New cash and UPI requests will appear here automatically.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Right Column: Activity and Quick Actions */}
      <div className="w-full md:col-span-5 space-y-6">
        {/* --- ACTIVITY STATS GRID --- */}
        <div>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-extrabold text-slate-800 text-base tracking-tight">Your Activity</h3>
            <Link to="/activity" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => navigate('/activity')}
              className="group relative bg-white border border-slate-100 rounded-3xl p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.015)] min-h-[115px] text-left transition-all duration-300 hover:border-emerald-200 hover:shadow-[0_12px_30px_rgba(16,185,129,0.06)] hover:-translate-y-1 active:scale-[0.97] cursor-pointer overflow-hidden"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/5 to-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-50 to-emerald-100/40 border border-emerald-100/60 flex items-center justify-center text-emerald-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <FileText size={16} className="stroke-[2.2]" />
                </div>
                {/* Pulsing indicator dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
              </div>
              <div className="mt-3 relative z-10">
                <div className="text-2xl font-black text-slate-800 tracking-tight leading-none transition-colors duration-300 group-hover:text-emerald-700">
                  {isLoading ? <Loader2 className="animate-spin text-slate-350" size={18} /> : activeRequests.length}
                </div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1.5">Live Requests</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/activity')}
              className="group relative bg-white border border-slate-100 rounded-3xl p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.015)] min-h-[115px] text-left transition-all duration-300 hover:border-amber-200 hover:shadow-[0_12px_30px_rgba(245,158,11,0.06)] hover:-translate-y-1 active:scale-[0.97] cursor-pointer overflow-hidden"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-amber-50/5 to-amber-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-50 to-amber-100/40 border border-amber-100/60 flex items-center justify-center text-amber-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Users size={16} className="stroke-[2.2]" />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
              </div>
              <div className="mt-3 relative z-10">
                <div className="text-2xl font-black text-slate-800 tracking-tight leading-none transition-colors duration-300 group-hover:text-amber-700">
                  {isLoading ? <Loader2 className="animate-spin text-slate-350" size={18} /> : pendingMatches.length}
                </div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1.5">Offers Recd</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/activity')}
              className="group relative bg-white border border-slate-100 rounded-3xl p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.015)] min-h-[115px] text-left transition-all duration-300 hover:border-indigo-200 hover:shadow-[0_12px_30px_rgba(99,102,241,0.06)] hover:-translate-y-1 active:scale-[0.97] cursor-pointer overflow-hidden"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-indigo-50/5 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-50 to-indigo-100/40 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <CheckCircle size={16} className="stroke-[2.2]" />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
              </div>
              <div className="mt-3 relative z-10">
                <div className="text-2xl font-black text-slate-800 tracking-tight leading-none transition-colors duration-300 group-hover:text-indigo-700">
                  {isLoading ? <Loader2 className="animate-spin text-slate-350" size={18} /> : completedCount}
                </div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1.5">Success Swaps</span>
              </div>
            </button>
          </div>
        </div>

        {/* --- QUICK ACTIONS --- */}
        <div>
          <h3 className="font-bold text-slate-800 text-base mb-3 px-1 tracking-tight">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/find-requests"
              className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-indigo-100 hover:shadow-[0_8px_30px_rgba(99,102,241,0.04)] hover:-translate-y-0.5 transition-all duration-300 text-left relative group cursor-pointer"
            >
              {newRequestsCount > 0 && (
                <span className="absolute -top-1.5 right-6 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[9px] font-black text-white shadow-sm border border-white animate-badge-pulse z-10">
                  {newRequestsCount > 9 ? '9+' : newRequestsCount}
                </span>
              )}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 transition-transform duration-300 group-hover:scale-110">
                  <Search size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Help Someone Nearby</h4>
                  <span className="text-xs text-slate-400 font-semibold mt-1 block">View what nearby people need and swap with them</span>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-300" size={20} />
            </Link>

            <Link
              to="/activity"
              className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-indigo-100 hover:shadow-[0_8px_30px_rgba(99,102,241,0.04)] hover:-translate-y-0.5 transition-all duration-300 text-left relative group cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100/50 flex items-center justify-center text-violet-600 transition-transform duration-300 group-hover:scale-110">
                  <FileText size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">My Swaps</h4>
                  <span className="text-xs text-slate-400 font-semibold mt-1 block">View and manage your active and past swaps</span>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-300" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {completedSwapForReview && (
        <ReviewModal
          matchId={completedSwapForReview.matchId}
          partner={completedSwapForReview.otherUser}
          onClose={() => setCompletedSwapForReview(null)}
          onSubmitSuccess={() => {
            setCompletedSwapForReview(null);
            queryClient.invalidateQueries({ queryKey: ['myRequests'] });
            queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
            queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
          }}
        />
      )}

      {reportMatchId && reportPartner && (
        <ReportModal
          matchId={reportMatchId}
          partner={reportPartner}
          onClose={() => {
            setReportMatchId(null);
            setReportPartner(null);
          }}
        />
      )}
    </div>
  );
}

export default Home;
