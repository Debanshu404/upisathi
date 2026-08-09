import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ChevronDown, Star, MessageSquare, AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMyRequests, useCancelRequest } from '../hooks/useExchanges';
import { 
  usePendingMatches, 
  useActiveMatches, 
  useMatchHistory, 
  useConfirmMatch, 
  useRejectMatch, 
  useCompleteMatch, 
  useCancelActiveMatch,
  useCompletedCounter,
  useCancelledCounter
} from '../hooks/useMatches';
import { userContext } from '../context/UserContext';
import { socketContext } from '../context/SocketContext';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';
import { Link } from 'react-router-dom';

const RequestCard = ({ request, onCancel }) => {
  const [isCancelling, setIsCancelling] = React.useState(false);

  const handleCancelClick = async (e) => {
    e.stopPropagation();
    setIsCancelling(true);
    await onCancel(request._id);
    setIsCancelling(false);
  };
  
  const isNeedCash = request.type === 'NEED_CASH';
  
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-all duration-300 last:mb-0">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md border ${
            isNeedCash 
              ? 'bg-indigo-50/70 text-indigo-600 border-indigo-100/30' 
              : 'bg-emerald-50/70 text-emerald-600 border-emerald-100/30'
          }`}>
            {isNeedCash ? 'Need Cash (Pay UPI)' : 'Need UPI (Pay Cash)'}
          </span>
          {request.status === 'CANCELLED' ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100/50">Cancelled</span>
          ) : request.status === 'COMPLETED' ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100/50">Completed</span>
          ) : (request.status === 'ACTIVE' && request.expired) ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200/50">Expired</span>
          ) : null}
        </div>
        <span className="font-extrabold text-indigo-600 text-base">₹{request.amount}</span>
      </div>
      <div className="text-xs text-slate-500 space-y-1.5 mt-3 font-semibold">
        {request.expiresAt && (
          <p>
            <span className="text-slate-400">Closes at:</span>{' '}
            {new Date(request.expiresAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
        )}
        {request.note && <p><span className="text-slate-400">Note:</span> {request.note}</p>}
        <div className="flex justify-between items-center mt-4 border-t border-slate-100 pt-2.5 flex-wrap gap-2">
          <p className="text-[10px] text-slate-400">
            Created: {new Date(request.createdAt).toLocaleString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </p>
          {request.status === 'ACTIVE' && request.expired === false && onCancel && (
            <button 
              onClick={handleCancelClick}
              disabled={isCancelling || request.hasMatch}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 border ${
                request.hasMatch 
                  ? 'bg-slate-50 text-slate-350 border-slate-200 cursor-not-allowed' 
                  : 'text-rose-600 bg-rose-50 border-rose-100/50 hover:bg-rose-100'
              }`}
              title={request.hasMatch ? "Cannot cancel a request with ongoing offers or swaps" : ""}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PendingMatchCard = ({ match, onConfirm, onReject }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isRejecting, setIsRejecting] = React.useState(false);

  const handleConfirmClick = async (e) => {
    e.stopPropagation();
    setIsConfirming(true);
    await onConfirm(match._id);
    setIsConfirming(false);
  };

  const handleRejectClick = async (e) => {
    e.stopPropagation();
    setIsRejecting(true);
    await onReject(match._id);
    setIsRejecting(false);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-all duration-300 last:mb-0">
      <div className="flex justify-between items-center mb-3">
          <Link to={`/profile/${match.accepter?._id}`} className="flex items-center space-x-3 hover:opacity-85 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
              {match.accepter?.avatar ? (
                <img src={match.accepter.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                  {match.accepter?.username?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{match.accepter?.username || 'Unknown User'}</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Wants to swap cash with you</p>
            </div>
          </Link>
      </div>
      
      <div className="flex space-x-3 mt-4 pt-3 border-t border-slate-100">
        <button 
          onClick={handleRejectClick}
          disabled={isRejecting || isConfirming}
          className="flex-1 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition-all border border-slate-200 text-xs active:scale-95 disabled:opacity-50"
        >
          {isRejecting ? <Loader2 className="animate-spin mx-auto text-slate-500" size={14}/> : 'Decline Offer'}
        </button>
        <button 
          onClick={handleConfirmClick}
          disabled={isRejecting || isConfirming}
          className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold rounded-xl hover:opacity-95 shadow-md shadow-emerald-500/10 transition-all text-xs active:scale-95 disabled:opacity-50"
        >
          {isConfirming ? <Loader2 className="animate-spin mx-auto text-white" size={14}/> : 'Accept Offer'}
        </button>
      </div>
    </div>
  );
};

const ActiveMatchCard = ({ match, onComplete, onCancelMatch, currentUser, onWriteReview, onReport }) => {
  const navigate = useNavigate();
  const [isCompleting, setIsCompleting] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);

  const isRequester = match.requester?._id === currentUser?._id || match.requester === currentUser?._id;
  const otherUser = isRequester ? match.accepter : match.requester;
  const hasCompleted = isRequester ? match.requesterCompleted : match.accepterCompleted;
  const hasReviewed = isRequester ? match.requesterReviewed : match.accepterReviewed;

  const handleCompleteClick = async (e) => {
    e.stopPropagation();
    setIsCompleting(true);
    await onComplete(match._id);
    setIsCompleting(false);
  };

  const handleCancelClick = async (e) => {
    e.stopPropagation();
    setIsCancelling(true);
    await onCancelMatch(match._id);
    setIsCancelling(false);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-all duration-300 last:mb-0">
      <div className="flex justify-between items-center mb-3">
          <Link to={`/profile/${otherUser?._id}`} className="flex items-center space-x-3 hover:opacity-85 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
              {otherUser?.avatar ? (
                <img src={otherUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                  {otherUser?.username?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{otherUser?.username || 'Unknown User'}</h3>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                Swap In Progress
              </p>
            </div>
          </Link>
        <div className="text-right">
           <span className="font-extrabold text-indigo-600 block">₹{match.request?.amount}</span>
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{match.request?.type === 'NEED_CASH' ? 'Cash' : 'UPI'}</span>
        </div>
      </div>

      <div className="my-4 px-2">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-600 -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
            style={{ width: hasCompleted ? '100%' : '50%' }}
          ></div>

          <div className="flex flex-col items-center z-10 relative">
            <div className="w-6.5 h-6.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-md shadow-indigo-600/10">
              ✓
            </div>
            <span className="text-[9px] font-bold text-indigo-600 mt-1">Offer Accepted</span>
          </div>

          <div className="flex flex-col items-center z-10 relative">
            <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-sm transition-all duration-300 ${
              hasCompleted 
                ? 'bg-indigo-600 text-white' 
                : 'bg-indigo-50 text-indigo-600 border-indigo-200 animate-pulse'
            }`}>
              {hasCompleted ? '✓' : '2'}
            </div>
            <span className={`text-[9px] font-bold mt-1 transition-colors ${
              hasCompleted ? 'text-indigo-600' : 'text-slate-400'
            }`}>
              Meet & Chat
            </span>
          </div>

          <div className="flex flex-col items-center z-10 relative">
            <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-sm transition-all duration-300 ${
              hasCompleted 
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10' 
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              {hasCompleted ? '✓' : '3'}
            </div>
            <span className={`text-[9px] font-bold mt-1 transition-colors ${
              hasCompleted ? 'text-emerald-600 font-extrabold' : 'text-slate-400'
            }`}>
              Finish Swap
            </span>
          </div>
        </div>
      </div>

      {(match.meetUpLocation || match.request?.note) && (
        <div className="mt-3 text-xs bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center space-x-1.5 text-slate-600 font-semibold">
          <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Meet Spot:</span>
          <span className="truncate flex-1 font-semibold text-slate-700">{match.meetUpLocation || match.request?.note}</span>
        </div>
      )}
      
      <div className="flex space-x-2 mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReport(match._id, otherUser);
          }}
          className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all active:scale-95 border border-rose-100/50 cursor-pointer flex items-center justify-center"
          title="Report Swap Partner"
        >
          <AlertCircle size={14} className="stroke-[2.2]" />
        </button>
        <button 
          onClick={handleCancelClick}
          disabled={isCancelling || isCompleting || hasCompleted}
          className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 text-xs border border-slate-200"
        >
          {isCancelling ? <Loader2 className="animate-spin mx-auto text-slate-500" size={14}/> : 'Cancel Swap'}
        </button>
        {hasCompleted ? (
          hasReviewed ? (
            <span className="flex-1 py-2 text-slate-400 bg-slate-50 border border-slate-200/50 rounded-xl font-bold text-center text-xs flex items-center justify-center">
              Reviewed ✓
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWriteReview(match);
              }}
              className="flex-1 py-2 bg-indigo-50 text-indigo-655 hover:bg-indigo-100 rounded-xl border border-indigo-100/35 transition-all text-xs font-bold active:scale-95 cursor-pointer flex items-center justify-center hover:scale-105"
            >
              Rate Partner
            </button>
          )
        ) : (
          <button 
            onClick={handleCompleteClick}
            disabled={isCancelling || isCompleting}
            className="flex-1 py-2 text-white font-extrabold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md text-xs bg-gradient-to-r from-indigo-600 to-indigo-500 bg-indigo-600 hover:from-indigo-700 hover:to-indigo-600 shadow-indigo-600/10"
          >
            {isCompleting ? <Loader2 className="animate-spin mx-auto text-white" size={14}/> : 'Mark Done'}
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/chat/${match._id}`, { state: { matchDetails: match } });
          }}
          disabled={isCancelling || isCompleting}
          className="flex-1 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold rounded-xl hover:opacity-95 shadow-md shadow-indigo-600/10 transition-all text-xs active:scale-95 relative"
        >
          <span>Chat</span>
          {(() => {
            const unreadCount = isRequester ? (match.requesterUnread || 0) : (match.accepterUnread || 0);
            return unreadCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                {unreadCount}
              </span>
            ) : null;
          })()}
        </button>
      </div>
      {hasCompleted && (
        <p className="text-[10px] text-center text-slate-400 font-bold mt-2 animate-pulse">Waiting for partner's confirmation...</p>
      )}
    </div>
  );
};

const CompletedMatchCard = ({ match, currentUser, onWriteReview, onReport }) => {
  const navigate = useNavigate();
  const isRequester = match.requester?._id === currentUser?._id || match.requester === currentUser?._id;
  const otherUser = isRequester ? match.accepter : match.requester;
  const hasReviewed = isRequester ? match.requesterReviewed : match.accepterReviewed;
  
  const isNeedCash = match.request?.type === 'NEED_CASH';
  const displayType = isRequester 
    ? (isNeedCash ? 'Need Cash (Pay UPI)' : 'Need UPI (Pay Cash)')
    : (isNeedCash ? 'Need UPI (Pay Cash)' : 'Need Cash (Pay UPI)');

  const formattedDate = match.completedAt 
    ? new Date(match.completedAt).toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : match.updatedAt
    ? new Date(match.updatedAt).toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : '';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-all duration-300 last:mb-0">
      <div className="flex justify-between items-center mb-3">
          <Link to={`/profile/${otherUser?._id}`} className="flex items-center space-x-3 hover:opacity-85 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
              {otherUser?.avatar ? (
                <img src={otherUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                  {otherUser?.username?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{otherUser?.username || 'Unknown User'}</h3>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                {match.status === 'COMPLETED' ? 'Completed Swap' : 'Cancelled Swap'}
              </p>
            </div>
          </Link>
        <div className="text-right">
           <span className="font-extrabold text-slate-800 text-sm block">₹{match.request?.amount || 0}</span>
           <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{displayType}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 border-t border-slate-100 pt-3 flex-wrap gap-2">
        <p className="text-[10px] text-slate-400 font-semibold">
          {match.status === 'COMPLETED' ? 'Completed: ' : 'Cancelled: '} {formattedDate}
        </p>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReport(match._id, otherUser);
            }}
            className="text-[10px] font-extrabold px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-100/50 transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
            title="Report Swap Partner"
          >
            <AlertCircle size={10} className="text-rose-500 mr-0.5" />
            <span>Report</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/chat/${match._id}`, { state: { matchDetails: match } });
            }}
            className="text-[10px] font-extrabold px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
          >
            <MessageSquare size={10} className="text-slate-500 mr-0.5" />
            <span>View Chat</span>
          </button>

          {match.status === 'COMPLETED' && (
            hasReviewed ? (
              <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/50 flex items-center space-x-1">
                <Star size={10} className="fill-slate-300 text-slate-300 mr-0.5" />
                <span>Reviewed</span>
              </span>
            ) : (
              <button
                onClick={() => onWriteReview(match)}
                className="text-[10px] font-extrabold px-3 py-1.5 bg-indigo-50 text-indigo-650 hover:bg-indigo-100 rounded-xl border border-indigo-100/35 transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
              >
                <Star size={10} className="fill-indigo-600/10 text-indigo-600 mr-0.5" />
                <span>Rate Partner</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryRow = ({ 
  title, 
  description, 
  count,
  colorClass, 
  isExpanded, 
  onToggle, 
  items, 
  onCancel, 
  onConfirm, 
  onReject, 
  isMatch, 
  isActiveMatch, 
  isHistoryMatch, 
  onWriteReview, 
  onComplete, 
  onCancelMatch, 
  currentUser,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onReport
}) => {
  const sentinelRef = React.useRef(null);

  React.useEffect(() => {
    if (!isExpanded || !hasNextPage || isFetchingNextPage || !sentinelRef.current) return;

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
  }, [isExpanded, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <div 
        onClick={() => items && onToggle()}
        className={`p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors ${items ? 'cursor-pointer' : ''}`}
      >
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">{description}</p>
        </div>
        <div className="flex items-center space-x-3">
          {typeof count === 'number' && (
            <span className={`font-black text-sm ${colorClass}`}>{count}</span>
          )}
          {items && <ChevronDown size={18} className={`text-slate-450 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />}
        </div>
      </div>
      {isExpanded && items && (
        <div className="p-4 bg-slate-50/40 border-t border-slate-100 max-h-96 overflow-y-auto">
          {items.length > 0 ? (
            <>
              {items.map(item => 
                isActiveMatch
                ? <ActiveMatchCard key={item._id} match={item} onComplete={onComplete} onCancelMatch={onCancelMatch} currentUser={currentUser} onWriteReview={onWriteReview} onReport={onReport} />
                : isMatch 
                ? <PendingMatchCard key={item._id} match={item} onConfirm={onConfirm} onReject={onReject} />
                : isHistoryMatch
                ? <CompletedMatchCard key={item._id} match={item} currentUser={currentUser} onWriteReview={onWriteReview} onReport={onReport} />
                : <RequestCard key={item._id} request={item} onCancel={onCancel} />
              )}
              {hasNextPage && (
                <div ref={sentinelRef} className="flex justify-center py-2.5">
                  <Loader2 className="animate-spin text-indigo-500" size={16} />
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-400 font-semibold text-center py-4">No records found</p>
          )}
        </div>
      )}
    </div>
  );
};

function ActivityCenter() {
  const navigate = useNavigate();
  const { user } = React.useContext(userContext);
  const { socket } = React.useContext(socketContext);
  const queryClient = useQueryClient();

  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'history'
  const [reviewMatch, setReviewMatch] = useState(null);
  const [reportMatchId, setReportMatchId] = useState(null);
  const [reportPartner, setReportPartner] = useState(null);

  const handleReportSelect = (matchId, partner) => {
    setReportMatchId(matchId);
    setReportPartner(partner);
  };

  // Queries
  const { 
    data: rawMyRequests, 
    isLoading: loadingMyRequests,
    fetchNextPage: fetchNextMyRequests,
    hasNextPage: hasNextMyRequests,
    isFetchingNextPage: isFetchingNextMyRequests
  } = useMyRequests({ enabled: !!user });

  const { data: rawPendingMatches, isLoading: loadingPendingMatches } = usePendingMatches({ enabled: !!user });
  const { data: rawActiveMatches, isLoading: loadingActiveMatches } = useActiveMatches({ enabled: !!user });

  const { 
    data: rawMatchHistory, 
    isLoading: loadingMatchHistory,
    fetchNextPage: fetchNextMatchHistory,
    hasNextPage: hasNextMatchHistory,
    isFetchingNextPage: isFetchingNextMatchHistory
  } = useMatchHistory({ enabled: !!user });

  const { data: rawCompletedCount } = useCompletedCounter({ enabled: !!user });
  const { data: rawCancelledCount } = useCancelledCounter({ enabled: !!user });

  const completedCount = rawCompletedCount?.data?.counter ?? rawCompletedCount?.counter ?? 0;
  const cancelledCount = rawCancelledCount?.data?.counter ?? rawCancelledCount?.counter ?? 0;
  const historyTotalCount = completedCount + cancelledCount;

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

  const matchHistory = rawMatchHistory?.pages
    ? rawMatchHistory.pages.flatMap(page => page?.data?.matches || page?.matches || [])
    : (Array.isArray(rawMatchHistory?.data) 
        ? rawMatchHistory.data 
        : (Array.isArray(rawMatchHistory) ? rawMatchHistory : []));

  // Mutations
  const cancelRequestMutation = useCancelRequest();
  const confirmMatchMutation = useConfirmMatch();
  const rejectMatchMutation = useRejectMatch();
  const completeMatchMutation = useCompleteMatch();
  const cancelActiveMatchMutation = useCancelActiveMatch();

  // Socket updates
  useEffect(() => {
    if (!socket?.current) return;

    const triggerRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingMatches'] });
      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
      queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
      queryClient.invalidateQueries({ queryKey: ['completedCounter'] });
      queryClient.invalidateQueries({ queryKey: ['cancelledCounter'] });
    };

    const events = [
      'newMatch',
      'confirmMatch',
      'rejectMatch',
      'completeMatch',
      'cancelActiveMatch'
    ];

    events.forEach(evt => socket.current.on(evt, triggerRefresh));

    return () => {
      if (socket?.current) {
        events.forEach(evt => socket.current.off(evt, triggerRefresh));
      }
    };
  }, [socket, queryClient]);

  const handleCancel = async (requestId) => {
    try {
      await cancelRequestMutation.mutateAsync(requestId);
    } catch (err) {
      console.error('Error cancelling request:', err);
    }
  };

  const handleConfirmMatch = async (matchId) => {
    try {
      await confirmMatchMutation.mutateAsync(matchId);
    } catch (err) {
      console.error('Error confirming match:', err);
    }
  };

  const handleRejectMatch = async (matchId) => {
    try {
      await rejectMatchMutation.mutateAsync(matchId);
    } catch (err) {
      console.error('Error rejecting match:', err);
    }
  };

  const handleCompleteMatch = async (matchId) => {
    try {
      await completeMatchMutation.mutateAsync(matchId);
    } catch (err) {
      console.error('Error completing match:', err);
    }
  };

  const handleCancelActiveMatch = async (matchId) => {
    try {
      await cancelActiveMatchMutation.mutateAsync(matchId);
    } catch (err) {
      console.error('Error cancelling active match:', err);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  // Determine if requests have matched offers
  const matchedRequestIds = new Set();
  pendingMatches.forEach(m => {
    if (m.request) matchedRequestIds.add(m.request._id || m.request);
  });
  activeExchanges.forEach(m => {
    if (m.request) matchedRequestIds.add(m.request._id || m.request);
  });

  let activeReqs = [], pastReqs = [];
  myRequests.forEach(r => {
    r.hasMatch = matchedRequestIds.has(r._id);
    
    if (r.status === 'ACTIVE' && r.expired !== true) {
      activeReqs.push(r);
    } else if (r.status === 'CANCELLED' || (r.status === 'ACTIVE' && r.expired === true)) {
      pastReqs.push(r);
    }
  });

  const completedMatches = matchHistory.filter(m => m.status === 'COMPLETED');
  const cancelledMatches = matchHistory.filter(m => m.status === 'CANCELLED');

  const categories = {
    activeRequests: activeReqs,
    matchedRequests: cancelledMatches,
    completedRequests: completedMatches,
    pastRequests: pastReqs,
    pendingMatches,
    activeExchanges
  };

  const isLoading = loadingMyRequests || loadingPendingMatches || loadingActiveMatches || loadingMatchHistory;

  const activeLiveCount = categories.activeRequests.length + categories.pendingMatches.length + categories.activeExchanges.length;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto pt-4 pb-20">
      <div className="flex items-center space-x-4 mb-6 px-2">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
        >
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Swaps</h1>
      </div>

      <div className="flex bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl mb-6 mx-2 border border-slate-200/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => {
            setActiveTab('live');
            setExpandedSection(null);
          }}
          className={`flex-1 py-2 text-sm font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center active:scale-98 ${
            activeTab === 'live'
              ? 'bg-white text-indigo-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          }`}
        >
          <span>Active</span>
          {activeLiveCount > 0 && (
            <span className={`ml-1.5 px-2 py-0.5 text-[9px] font-black rounded-full transition-colors ${
              activeTab === 'live' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {activeLiveCount}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('history');
            setExpandedSection(null);
          }}
          className={`flex-1 py-2 text-sm font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center active:scale-98 ${
            activeTab === 'history'
              ? 'bg-white text-indigo-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          }`}
        >
          <span>History</span>
          {historyTotalCount > 0 && (
            <span className={`ml-1.5 px-2 py-0.5 text-[9px] font-black rounded-full transition-colors ${
              activeTab === 'history' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {historyTotalCount}
            </span>
          )}
        </button>
      </div>
      
      <div className="relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-2xl">
            <Loader2 className="animate-spin text-indigo-600" size={24} />
          </div>
        )}

        {activeTab === 'live' ? (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden mx-2">
            <CategoryRow
              title="My Live Requests"
              description={categories.activeRequests.length === 1 ? '1 request is live' : `${categories.activeRequests.length} requests are live`}
              count={categories.activeRequests.length}
              colorClass="text-indigo-600"
              isExpanded={expandedSection === 'activeRequests'}
              onToggle={() => toggleSection('activeRequests')}
              items={categories.activeRequests}
              onCancel={handleCancel}
              hasNextPage={hasNextMyRequests}
              isFetchingNextPage={isFetchingNextMyRequests}
              fetchNextPage={fetchNextMyRequests}
            />

            <CategoryRow
              title="Offers Received"
              description={categories.pendingMatches.length === 1 ? '1 offer received' : `${categories.pendingMatches.length} offers received`}
              count={categories.pendingMatches.length}
              colorClass="text-amber-600"
              isExpanded={expandedSection === 'pendingMatches'}
              onToggle={() => toggleSection('pendingMatches')}
              items={categories.pendingMatches}
              isMatch={true}
              onConfirm={handleConfirmMatch}
              onReject={handleRejectMatch}
            />
            
            <CategoryRow
              title="Ongoing Swaps"
              description={categories.activeExchanges.length === 1 ? '1 active swap' : `${categories.activeExchanges.length} active swaps`}
              count={categories.activeExchanges.length}
              colorClass="text-emerald-600"
              isExpanded={expandedSection === 'activeExchanges'}
              onToggle={() => toggleSection('activeExchanges')}
              items={categories.activeExchanges}
              isActiveMatch={true}
              onComplete={handleCompleteMatch}
              onCancelMatch={handleCancelActiveMatch}
              currentUser={user}
              onWriteReview={setReviewMatch}
              onReport={handleReportSelect}
            />
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden mx-2">
            <CategoryRow
              title="Past Deals"
              description="Swaps that were accepted"
              count={cancelledCount}
              colorClass="text-indigo-600"
              isExpanded={expandedSection === 'matchedRequests'}
              onToggle={() => toggleSection('matchedRequests')}
              items={categories.matchedRequests}
              isHistoryMatch={true}
              currentUser={user}
              hasNextPage={hasNextMatchHistory}
              isFetchingNextPage={isFetchingNextMatchHistory}
              fetchNextPage={fetchNextMatchHistory}
              onReport={handleReportSelect}
            />

            <CategoryRow
              title="Successful Swaps"
              description="Finished swaps"
              count={completedCount}
              colorClass="text-emerald-600"
              isExpanded={expandedSection === 'completedRequests'}
              onToggle={() => toggleSection('completedRequests')}
              items={categories.completedRequests}
              isHistoryMatch={true}
              currentUser={user}
              onWriteReview={setReviewMatch}
              hasNextPage={hasNextMatchHistory}
              isFetchingNextPage={isFetchingNextMatchHistory}
              fetchNextPage={fetchNextMatchHistory}
              onReport={handleReportSelect}
            />
            
            <CategoryRow
              title="Cancelled & Expired Swaps"
              description="Unfinished or cancelled swaps"
              colorClass="text-slate-400"
              isExpanded={expandedSection === 'pastRequests'}
              onToggle={() => toggleSection('pastRequests')}
              items={categories.pastRequests}
              hasNextPage={hasNextMyRequests}
              isFetchingNextPage={isFetchingNextMyRequests}
              fetchNextPage={fetchNextMyRequests}
            />
          </div>
        )}
      </div>

      {reviewMatch && (
        <ReviewModal
          matchId={reviewMatch._id}
          partner={reviewMatch.requester?._id === user?._id ? reviewMatch.accepter : reviewMatch.requester}
          onClose={() => setReviewMatch(null)}
          onSubmitSuccess={() => {
            setReviewMatch(null);
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
          onSubmitSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
            queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
          }}
        />
      )}
    </div>
  );
}

export default ActivityCenter;
