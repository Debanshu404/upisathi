import React, { useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Loader2, Smartphone, Banknote } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useActiveMatches, useMatchHistory } from '../hooks/useMatches';
import { userContext } from '../context/UserContext';
import { socketContext } from '../context/SocketContext';

const ChatRow = ({ chat, user, navigate }) => {
  const isRequester = chat.requester?._id === user?._id || chat.requester === user?._id;
  const otherUser = isRequester ? chat.accepter : chat.requester;
  const unreadCount = chat.status === 'ACTIVE'
    ? (isRequester ? (chat.requesterUnread || 0) : (chat.accepterUnread || 0))
    : 0;
  const requestType = chat.request?.type;
  
  const sendMethod = isRequester 
    ? (requestType === 'NEED_CASH' ? 'UPI' : 'Cash') 
    : (requestType === 'NEED_CASH' ? 'Cash' : 'UPI');
  const receiveMethod = isRequester 
    ? (requestType === 'NEED_CASH' ? 'Cash' : 'UPI') 
    : (requestType === 'NEED_CASH' ? 'UPI' : 'Cash');

  return (
    <div
      onClick={() => navigate(`/chat/${chat._id}`, { state: { matchDetails: chat } })}
      className="bg-white border border-slate-100 hover:border-indigo-100 rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.03)] flex items-center justify-between cursor-pointer transition-all duration-350 active:scale-99 mx-1"
    >
      <div className="flex items-center space-x-3.5 min-w-0 flex-1 mr-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            {otherUser?.avatar ? (
              <img src={otherUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                {otherUser?.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
          {chat.status === 'ACTIVE' && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-extrabold text-slate-800 text-sm truncate leading-tight">
              {otherUser?.username || 'Unknown User'}
            </h3>
            {unreadCount > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1.5 mt-1.5">
            <span className="text-[9px] text-slate-500 font-bold bg-slate-50 border border-slate-100/60 px-2 py-0.5 rounded-lg flex items-center space-x-1">
              {sendMethod === 'UPI' ? <Smartphone size={9} className="text-emerald-500 stroke-[2.5]" /> : <Banknote size={9} className="text-indigo-500 stroke-[2.5]" />}
              <span>{sendMethod}</span>
            </span>
            <span className="text-slate-300 text-[10px]">➔</span>
            <span className="text-[9px] text-slate-500 font-bold bg-slate-50 border border-slate-100/60 px-2 py-0.5 rounded-lg flex items-center space-x-1">
              {receiveMethod === 'UPI' ? <Smartphone size={9} className="text-emerald-500 stroke-[2.5]" /> : <Banknote size={9} className="text-indigo-500 stroke-[2.5]" />}
              <span>{receiveMethod}</span>
            </span>
          </div>
          
          <p className="text-[10px] text-slate-400 font-semibold truncate mt-2 max-w-[220px]">
            {chat.meetUpLocation || chat.request?.note ? `Spot: ${chat.meetUpLocation || chat.request?.note}` : 'Tap to coordinate meeting point'}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
        <span className="font-black text-indigo-600 text-base">₹{chat.request?.amount || 0}</span>
        <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
          chat.status === 'ACTIVE' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
            : chat.status === 'COMPLETED'
            ? 'bg-slate-50 text-slate-500 border-slate-200/50'
            : 'bg-rose-50 text-rose-500 border-rose-100/50'
        }`}>
          {chat.status === 'ACTIVE' 
            ? 'Ongoing' 
            : chat.status === 'COMPLETED'
            ? 'Completed'
            : 'Cancelled'}
        </span>
      </div>
    </div>
  );
};

function Chats() {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const { socket } = useContext(socketContext);
  const queryClient = useQueryClient();
  const sentinelRef = useRef(null);

  const { data: rawActiveMatches, isLoading: isLoadingActive } = useActiveMatches({
    enabled: !!user,
  });

  const { 
    data: rawMatchHistory, 
    isLoading: isLoadingHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useMatchHistory({
    enabled: !!user,
  });

  const activeList = rawActiveMatches?.data || rawActiveMatches || [];
  const historyList = rawMatchHistory?.pages
    ? rawMatchHistory.pages.flatMap(page => page?.data?.matches || page?.matches || [])
    : (Array.isArray(rawMatchHistory?.data) 
        ? rawMatchHistory.data 
        : (Array.isArray(rawMatchHistory) ? rawMatchHistory : []));

  const activeChats = Array.isArray(activeList) ? activeList.filter(m => m.status === 'ACTIVE') : [];
  const pastChats = Array.isArray(historyList) ? historyList.filter(m => m.status === 'COMPLETED' || m.status === 'CANCELLED') : [];

  const isLoading = isLoadingActive || isLoadingHistory;
  const hasNoChats = activeChats.length === 0 && pastChats.length === 0;

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !sentinelRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    }, {
      root: null,
      threshold: 0.1
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Real-time socket events for invalidating query cache
  useEffect(() => {
    if (!socket?.current) return;

    const triggerRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
      queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
    };

    socket.current.on('newMatch', triggerRefresh);
    socket.current.on('confirmMatch', triggerRefresh);
    socket.current.on('rejectMatch', triggerRefresh);
    socket.current.on('completeMatch', triggerRefresh);
    socket.current.on('cancelActiveMatch', triggerRefresh);
    socket.current.on('newMessage', triggerRefresh);

    return () => {
      if (socket.current) {
        socket.current.off('newMatch', triggerRefresh);
        socket.current.off('confirmMatch', triggerRefresh);
        socket.current.off('rejectMatch', triggerRefresh);
        socket.current.off('completeMatch', triggerRefresh);
        socket.current.off('cancelActiveMatch', triggerRefresh);
        socket.current.off('newMessage', triggerRefresh);
      }
    };
  }, [socket, queryClient]);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto pt-4 pb-20 px-2">
      <div className="mb-6 px-1">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Chats</h1>
        <p className="text-xs text-slate-450 text-slate-400 font-semibold mt-1.5 leading-relaxed">Chat with swap partners to coordinate meeting spots.</p>
      </div>

      <div className="relative min-h-[300px]">
        {isLoading && !rawMatchHistory?.pages ? (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-indigo-600" size={24} />
          </div>
        ) : hasNoChats ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] mx-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100/40 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <MessageSquare size={22} className="stroke-[2.5]" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm">No Chats Yet</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mt-2 leading-relaxed">
              Your ongoing and past swap chats will show up here.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 px-5 py-2.5 bg-gradient-to-tr from-indigo-600 to-violet-650 bg-indigo-600 text-white rounded-xl font-extrabold text-xs shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
            >
              Ask for Cash/UPI
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            {activeChats.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Active Swaps ({activeChats.length})</h2>
                {activeChats.map((chat) => (
                  <ChatRow key={chat._id} chat={chat} user={user} navigate={navigate} />
                ))}
              </div>
            )}
            
                        {pastChats.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Past Swaps</h2>
                {pastChats.map((chat) => (
                  <ChatRow key={chat._id} chat={chat} user={user} navigate={navigate} />
                ))}
                
                {/* Scroll Sentinel */}
                {hasNextPage && (
                  <div ref={sentinelRef} className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-indigo-600" size={20} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chats;
