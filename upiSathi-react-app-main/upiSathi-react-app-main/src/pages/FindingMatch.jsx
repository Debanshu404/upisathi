import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePendingMatches, useConfirmMatch, useRejectMatch } from '../hooks/useMatches';
import { socketContext } from '../context/SocketContext';

function FindingMatch() {
  const navigate = useNavigate();
  const { socket } = useContext(socketContext);
  const queryClient = useQueryClient();
  const [statusText, setStatusText] = useState("Broadcasting coordinates...");
  const [actionInProgressId, setActionInProgressId] = useState(null);
  const [activeAction, setActiveAction] = useState(null); // 'accept' | 'decline'

  // Query
  const { data: rawPendingMatches } = usePendingMatches();
  const pendingMatches = Array.isArray(rawPendingMatches?.data) 
    ? rawPendingMatches.data 
    : (Array.isArray(rawPendingMatches) ? rawPendingMatches : []);

  // Mutations
  const confirmMatchMutation = useConfirmMatch();
  const rejectMatchMutation = useRejectMatch();

  // Cycle status logs in radar screen
  useEffect(() => {
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
  }, []);

  // Real-time socket events
  useEffect(() => {
    if (!socket?.current) return;

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['pendingMatches'] });
    };

    socket.current.on('newMatch', handleUpdate);
    socket.current.on('rejectMatch', handleUpdate);
    socket.current.on('cancelActiveMatch', handleUpdate);

    return () => {
      socket.current.off('newMatch', handleUpdate);
      socket.current.off('rejectMatch', handleUpdate);
      socket.current.off('cancelActiveMatch', handleUpdate);
    };
  }, [socket, queryClient]);

  const handleAccept = async (matchId) => {
    setActionInProgressId(matchId);
    setActiveAction('accept');
    try {
      await confirmMatchMutation.mutateAsync(matchId);
      navigate(`/chat/${matchId}`);
    } catch (err) {
      console.error("Error confirming match:", err);
    } finally {
      setActionInProgressId(null);
      setActiveAction(null);
    }
  };

  const handleDecline = async (matchId) => {
    setActionInProgressId(matchId);
    setActiveAction('decline');
    try {
      await rejectMatchMutation.mutateAsync(matchId);
    } catch (err) {
      console.error("Error rejecting match:", err);
    } finally {
      setActionInProgressId(null);
      setActiveAction(null);
    }
  };

  if (pendingMatches.length > 0) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-6 pb-20 justify-center">
        {/* Match Card Wrapper */}
        <div className="w-full bg-white border border-gray-200 rounded-3xl p-6 shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header Banner */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          {/* Success Icon */}
          <div className="flex justify-center mb-4 mt-2">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-inner relative">
              <span className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white text-base font-bold animate-bounce shadow-md">
                ✓
              </span>
              <span className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-25"></span>
            </div>
          </div>

          <h2 className="text-xl font-black text-center text-gray-900 mb-1">
            {pendingMatches.length === 1 ? 'Offer Received!' : `${pendingMatches.length} Offers Received!`}
          </h2>
          <p className="text-xs text-gray-400 text-center font-medium mb-6">
            {pendingMatches.length === 1 
              ? 'Someone nearby is ready to swap cash with you.' 
              : 'Multiple people want to help. Choose one to start.'}
          </p>

          {/* Scrollable list of matches */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {pendingMatches.map((match) => {
              const accepter = match.accepter;
              const request = match.request;
              return (
                <div 
                  key={match._id} 
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col space-y-3 shadow-sm hover:shadow transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-200 flex-shrink-0">
                      {accepter?.avatar ? (
                        <img src={accepter.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                          {accepter?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-gray-800 text-sm truncate">{accepter?.username || 'Unknown User'}</h3>
                      <p className="text-[11px] text-gray-500 font-medium">Offers to swap with you</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-primary block">₹{request?.amount}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                        {request?.type?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Actions inside list card */}
                  <div className="flex space-x-2 pt-2 border-t border-gray-150/50">
                    <button
                      onClick={() => handleDecline(match._id)}
                      disabled={actionInProgressId !== null}
                      className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-xs disabled:opacity-50 flex items-center justify-center cursor-pointer"
                    >
                      {actionInProgressId === match._id && activeAction === 'decline' ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        'Decline Offer'
                      )}
                    </button>
                    <button
                      onClick={() => handleAccept(match._id)}
                      disabled={actionInProgressId !== null}
                      className="flex-2 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold rounded-xl hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition-all text-xs shadow-sm disabled:opacity-50 flex items-center justify-center cursor-pointer"
                    >
                      {actionInProgressId === match._id && activeAction === 'accept' ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        'Accept & Chat'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Go Home button in case they want to leave */}
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => navigate('/', { replace: true })}
              className="text-xs text-gray-400 font-semibold hover:text-gray-600 underline cursor-pointer"
            >
              Go to Home Screen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full pt-10 max-w-md mx-auto">
      
      {/* Radar Sonar Animation Area */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-10 mt-10 bg-indigo-50/10 rounded-full border border-indigo-100/50 shadow-inner overflow-hidden">
        {/* Pulsing Concentric Sonar Waves */}
        <div className="absolute w-48 h-48 bg-primary/5 border border-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute w-32 h-32 bg-primary/10 border border-primary/30 rounded-full animate-pulse"></div>
        
        {/* Sonar Grid Lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
          <div className="w-full h-[1.5px] bg-primary"></div>
          <div className="h-full w-[1.5px] bg-primary"></div>
          <div className="absolute w-44 h-44 rounded-full border border-dashed border-primary"></div>
          <div className="absolute w-28 h-28 rounded-full border border-dashed border-primary"></div>
        </div>

        {/* Rotating Sonar Beam */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent rounded-full animate-spin pointer-events-none" style={{ animationDuration: '5s' }}></div>

        {/* Central Core Indicator */}
        <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.45)] border-4 border-white">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-white rounded-full animate-spin" style={{ animationDuration: '1.2s' }}></div>
        </div>
      </div>

      <h1 className="text-2xl font-black text-center text-gray-900 mb-2">Looking for Helpers...</h1>
      
      {/* Dynamic Status Log */}
      <p className="text-sm font-semibold text-primary text-center max-w-[280px] h-6 flex items-center justify-center transition-all duration-300">
        {statusText}
      </p>
      
      <p className="text-xs text-gray-400 text-center max-w-[250px] mb-12 mt-2 font-medium">
        We are looking for people who can swap with you. We'll show their offers here!
      </p>

      <button 
        onClick={() => navigate('/', { replace: true })}
        className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition-all text-sm cursor-pointer"
      >
        <Home size={18} className="text-gray-500 stroke-[2.5]" />
        <span>Return to Home</span>
      </button>

    </div>
  );
}

export default FindingMatch;
