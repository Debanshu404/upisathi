import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Send, Loader2, ChevronDown, ChevronUp, MapPin, Banknote, Smartphone, MessageSquare, ArrowRight, ShieldCheck, AlertCircle, Star } from "lucide-react";
import { getChat, getActiveMatches, getChatHistory, getMatchHistory } from "../services/api";
import { userContext } from "../context/UserContext";
import { socketContext } from "../context/SocketContext";
import ReportModal from "../components/ReportModal";

const mergeUniqueMessages = (...messageGroups) => {
  const seenIds = new Set();

  return messageGroups
    .flat()
    .filter(Boolean)
    .filter((message) => {
      const messageId = message?._id?.toString();
      if (!messageId) return true;
      if (seenIds.has(messageId)) return false;

      seenIds.add(messageId);
      return true;
    })
    .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
};

function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(userContext);
  const { socket } = useContext(socketContext);

  const stateMatchDetails = location.state?.matchDetails;

  const timer = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [typers, setTypers] = useState([]);
  const [matchDetails, setMatchDetails] = useState(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Pagination states & refs
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const topSentinelRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const isInitialScrollDone = useRef(false);
  const scrollInfoRef = useRef({ prevScrollHeight: 0, prevScrollTop: 0, shouldAdjustScroll: false });

  // Reset pagination state when matchId changes
  useEffect(() => {
    isInitialScrollDone.current = false;
    setMessages([]);
    setHasMore(false);
    setNextCursor(null);
  }, [matchId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const lastMessageId = lastMessage?._id || lastMessage?.createdAt;
    
    // Scroll to bottom only on initial load or when a new message is appended (last message ID changed)
    if (lastMessageId !== lastMessageIdRef.current || typers.length > 0) {
      scrollToBottom();
      lastMessageIdRef.current = lastMessageId;
    }
  }, [messages, typers]);

  useLayoutEffect(() => {
    if (scrollInfoRef.current.shouldAdjustScroll && chatContainerRef.current) {
      const scrollContainer = chatContainerRef.current;
      const { prevScrollHeight, prevScrollTop } = scrollInfoRef.current;
      const newScrollHeight = scrollContainer.scrollHeight;
      
      // Adjust scroll position before paint to prevent jump
      scrollContainer.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
      
      // Reset adjustment flag
      scrollInfoRef.current.shouldAdjustScroll = false;
    }
  }, [messages]);

  useEffect(() => {
    if (!newMessage?.trim() || !socket?.current || matchDetails?.status !== 'ACTIVE') return;

    socket.current.emit("typing", { username: user.username, matchId });
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      if (socket.current) {
        socket.current.emit("stopTyping", { username: user.username, matchId });
      }
    }, 1000);
  }, [newMessage, socket, user, matchId, matchDetails]);

  useEffect(() => {
    const currentSocket = socket?.current;

    const fetchHistoryAndJoin = async () => {
      setIsLoading(true);
      try {
        let initialChats = [];
        let fetchedHasMore = false;
        let fetchedNextCursor = null;
        let currentMatch = null;
        let isHistory = false;

        if (stateMatchDetails) {
          currentMatch = stateMatchDetails;
          isHistory = currentMatch.status !== 'ACTIVE';
          const chatRes = !isHistory ? await getChat(matchId) : await getChatHistory(matchId);
          const responseData = chatRes.data || chatRes;
          initialChats = responseData?.chats || [];
          fetchedHasMore = responseData?.hasMore || false;
          fetchedNextCursor = responseData?.nextCursor || null;
        } else {
          // 1. Fetch matches first to know if it's active or history
          const [activeRes, historyRes] = await Promise.all([
            getActiveMatches().catch(() => ({ data: [] })),
            getMatchHistory().catch(() => ({ data: [] }))
          ]);

          const activeList = activeRes.data || activeRes;
          const historyData = historyRes.data || historyRes;
          const historyList = Array.isArray(historyData) 
            ? historyData 
            : (historyData?.matches || []);

          const activeMatch = Array.isArray(activeList) ? activeList.find(m => m._id === matchId) : null;
          const historyMatch = Array.isArray(historyList) ? historyList.find(m => m._id === matchId) : null;

          if (activeMatch) {
            currentMatch = activeMatch;
            const chatRes = await getChat(matchId);
            const responseData = chatRes.data || chatRes;
            initialChats = responseData?.chats || [];
            fetchedHasMore = responseData?.hasMore || false;
            fetchedNextCursor = responseData?.nextCursor || null;
          } else if (historyMatch) {
            currentMatch = historyMatch;
            isHistory = true;
            const chatHistoryRes = await getChatHistory(matchId);
            const responseData = chatHistoryRes.data || chatHistoryRes;
            initialChats = responseData?.chats || [];
            fetchedHasMore = responseData?.hasMore || false;
            fetchedNextCursor = responseData?.nextCursor || null;
          } else {
            throw new Error("Match not found in your swaps.");
          }
        }
        
        setMessages((currentMessages) => mergeUniqueMessages(initialChats, currentMessages));
        setHasMore(fetchedHasMore);
        setNextCursor(fetchedNextCursor);

        let chatOtherUser = null;
        if (initialChats && initialChats.length > 0) {
          const otherMsg = initialChats.find((m) => typeof m.sender === "object" && m.sender?._id !== user._id);
          if (otherMsg) chatOtherUser = otherMsg.sender;
        }

        if (currentMatch) {
          setMatchDetails(currentMatch);
          const isRequester = currentMatch.requester?._id === user._id || currentMatch.requester === user._id;
          const counterpart = isRequester ? currentMatch.accepter : currentMatch.requester;
          const mergedUser = chatOtherUser && (chatOtherUser._id === counterpart._id || chatOtherUser._id === counterpart)
            ? { ...counterpart, ...chatOtherUser }
            : counterpart;
          setOtherUser(mergedUser);
        } else if (chatOtherUser) {
          setOtherUser(chatOtherUser);
        }

        // 2. Join Room using ack callback as per user's backend code (only if ACTIVE)
        if (!isHistory && currentSocket) {
          currentSocket.emit("joinRoom", matchId, (response) => {
            if (!response.success) {
              setError(response.error || "Failed to join chat room");
            }
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load chat");
        console.error(err);
      } finally {
        setIsLoading(false);
        // Scroll to bottom immediately on initial fetch and mark scroll done
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
          isInitialScrollDone.current = true;
        }, 50);
      }
    };

    fetchHistoryAndJoin();

    // 3. Listen for incoming messages (only if active)
    const handleNewMessage = (chatObj) => {
      setMessages((currentMessages) => mergeUniqueMessages(currentMessages, [chatObj]));
    };

    const handleTyping = (username) => {
      setTypers((prev) => {
        const isExists = prev.find((typer) => typer === username);
        if (!isExists) {
          return [...prev, username];
        } else {
          return prev;
        }
      });
    };

    const handleStopTyping = (username) => {
      setTypers((prev) => prev.filter((typer) => typer !== username));
    };

    if (currentSocket) {
      currentSocket.on("newMessage", handleNewMessage);
      currentSocket.on("typing", handleTyping);
      currentSocket.on("stopTyping", handleStopTyping);
    }

    return () => {
      if (currentSocket) {
        currentSocket.off("newMessage", handleNewMessage);
        currentSocket.off("typing", handleTyping);
        currentSocket.off("stopTyping", handleStopTyping);
        currentSocket.emit("leaveRoom", matchId);
      }
    };
  }, [matchId, socket, user._id]);

  const loadMoreMessages = React.useCallback(async () => {
    if (isHistoryLoading || !hasMore || !nextCursor) return;

    setIsHistoryLoading(true);
    const scrollContainer = chatContainerRef.current;
    const prevScrollHeight = scrollContainer ? scrollContainer.scrollHeight : 0;
    const prevScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    try {
      let chatRes;
      const isHistory = matchDetails?.status !== 'ACTIVE';
      if (!isHistory) {
        chatRes = await getChat(matchId, nextCursor);
      } else {
        chatRes = await getChatHistory(matchId, nextCursor);
      }

      const responseData = chatRes.data || chatRes;
      const newChats = responseData?.chats || [];
      const newHasMore = responseData?.hasMore || false;
      const newNextCursor = responseData?.nextCursor || null;

      if (newChats.length > 0) {
        if (scrollContainer) {
          scrollInfoRef.current = {
            prevScrollHeight,
            prevScrollTop,
            shouldAdjustScroll: true
          };
        }
        setMessages((currentMessages) => mergeUniqueMessages(newChats, currentMessages));
        setHasMore(newHasMore);
        setNextCursor(newNextCursor);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load historical messages:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [nextCursor, hasMore, isHistoryLoading, matchId, matchDetails]);

  useEffect(() => {
    if (!hasMore || isHistoryLoading || !topSentinelRef.current || !chatContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isInitialScrollDone.current) {
          loadMoreMessages();
        }
      },
      {
        root: chatContainerRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(topSentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isHistoryLoading, loadMoreMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket?.current) return;

    setIsSending(true);
    setError(null);

    // Emit sendMessage with ack callback
    socket.current.emit(
      "sendMessage",
      { matchId, message: newMessage },
      (response) => {
        setIsSending(false);
        if (response.success) {
          setNewMessage("");
          // We don't append here because the server will emit 'newMessage' to everyone in the room
        } else {
          setError(response.error || "Failed to send message");
        }
      },
    );
  };

  const otherTypers = typers.filter((username) => username !== user.username);

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto bg-white md:my-4 md:h-[calc(100dvh-2rem)] md:rounded-[2rem] md:border md:border-slate-200/80 md:shadow-[0_24px_70px_rgba(15,23,42,0.12)] overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3.5 bg-white/95 backdrop-blur-xl border-b border-slate-100 z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-slate-700" />
        </button>
        <Link to={`/profile/${otherUser?._id}`} className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-85 transition-opacity">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white ring-1 ring-slate-200 shadow-sm">
              {otherUser?.avatar ? (
                <img
                  src={otherUser.avatar}
                  alt={`${otherUser?.username || "Swap partner"} avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-black">
                  {otherUser?.username?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
            {(!matchDetails || matchDetails.status === 'ACTIVE') && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[3px] border-white"></span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
              {otherUser?.username || "Swap Chat"}
            </h1>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              <div className="flex items-center gap-0.5 text-[10px] text-slate-500 font-semibold leading-none">
                <ShieldCheck size={11} className="text-emerald-500" />
                <span>
                  {otherTypers.length > 0 
                    ? "Typing..." 
                    : matchDetails?.status === 'COMPLETED'
                    ? "Completed"
                    : matchDetails?.status === 'CANCELLED'
                    ? "Cancelled"
                    : "Active"}
                </span>
              </div>
              
              {otherUser?.trustScore != null && (
                <>
                  <span className="w-0.5 h-0.5 bg-slate-350 rounded-full"></span>
                  <div className="flex items-center gap-0.5 text-[10px] text-amber-600 font-black leading-none">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>{Number(otherUser.trustScore).toFixed(1)}</span>
                    {otherUser?.totalReviews != null && (
                      <span className="text-slate-400 font-bold">({otherUser.totalReviews})</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Link>
        {matchDetails?.request?.amount != null && (
          <div className="text-right flex-shrink-0 bg-indigo-50 border border-indigo-100/70 rounded-xl px-3 py-2">
            <span className="block text-[8px] uppercase tracking-wider text-indigo-400 font-black">Amount</span>
            <span className="block text-sm leading-tight text-indigo-700 font-black">₹{matchDetails.request.amount}</span>
          </div>
        )}
        {matchDetails && otherUser && (
          <button
            onClick={() => setShowReportModal(true)}
            className="w-10 h-10 flex items-center justify-center hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0 border border-slate-100 cursor-pointer"
            title="Report Swap Partner"
          >
            <AlertCircle size={18} className="stroke-[2.2]" />
          </button>
        )}
      </header>

      {/* Collapsible Match Details Header */}
      {matchDetails && (
        <div className="bg-white border-b border-slate-100 z-10 flex flex-col">
          <button 
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="flex justify-between items-center gap-4 px-5 py-3 hover:bg-slate-50/70 transition-colors cursor-pointer text-left"
            aria-expanded={isDetailsExpanded}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={14} />
              </span>
              <div className="min-w-0">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Swap details</span>
                <span className="text-[9px] text-slate-400 font-semibold block truncate">Payment and meeting information</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
              <span className="text-[10px] font-bold">{isDetailsExpanded ? 'Hide' : 'View'}</span>
              {isDetailsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </button>
          
          {isDetailsExpanded && (
            <div className="px-5 pb-4 pt-2 border-t border-slate-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
              {/* Swap direction panel */}
              {(() => {
                const isRequester = matchDetails.requester?._id === user._id || matchDetails.requester === user._id;
                const requestType = matchDetails.request?.type;
                const sendMethod = isRequester ? (requestType === 'NEED_CASH' ? 'UPI' : 'Cash') : (requestType === 'NEED_CASH' ? 'Cash' : 'UPI');
                const receiveMethod = isRequester ? (requestType === 'NEED_CASH' ? 'Cash' : 'UPI') : (requestType === 'NEED_CASH' ? 'UPI' : 'Cash');
                return (
                  <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-100 rounded-2xl p-3 text-xs">
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">You Send</span>
                      <div className="flex items-center space-x-1.5 mt-1">
                        {sendMethod === 'UPI' ? <Smartphone size={12} className="text-emerald-500 stroke-[2.5]" /> : <Banknote size={12} className="text-indigo-500 stroke-[2.5]" />}
                        <span className="font-extrabold text-slate-700">{sendMethod}</span>
                      </div>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                      <ArrowRight size={13} />
                    </span>
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">You Receive</span>
                      <div className="flex items-center space-x-1.5 mt-1">
                        {receiveMethod === 'UPI' ? <Smartphone size={12} className="text-emerald-500 stroke-[2.5]" /> : <Banknote size={12} className="text-indigo-500 stroke-[2.5]" />}
                        <span className="font-extrabold text-slate-700">{receiveMethod}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Location details */}
              <div className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold bg-indigo-50/50 border border-indigo-100/70 p-3 rounded-2xl">
                <MapPin size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Meeting Point</span>
                  <span className="text-indigo-900 block">{matchDetails.meetUpLocation || matchDetails.request?.note || 'TBD - Discuss in chat'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 text-rose-700 text-xs px-4 py-3 border-b border-rose-100 font-bold flex items-center justify-center gap-2">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-5 bg-gradient-to-b from-slate-50/80 via-slate-50/40 to-white"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
              <Loader2 className="animate-spin text-indigo-600" size={22} />
            </div>
            <p className="text-xs text-slate-400 font-bold">Loading conversation...</p>
          </div>
        ) : messages.length === 0 && otherTypers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 bg-white border border-indigo-100 rounded-3xl flex items-center justify-center mb-4 shadow-[0_8px_24px_rgba(99,102,241,0.08)]">
              <MessageSquare size={27} className="text-indigo-600 stroke-[2.2]" />
            </div>
            <h2 className="text-base font-black text-slate-800">
              {matchDetails?.status === 'COMPLETED' || matchDetails?.status === 'CANCELLED' 
                ? "No conversation history" 
                : "Start the conversation"}
            </h2>
            <p className="text-slate-400 font-medium text-xs max-w-xs mt-1.5 leading-relaxed">
              {matchDetails?.status === 'COMPLETED' || matchDetails?.status === 'CANCELLED'
                ? "No messages were sent during this swap."
                : "Say hello and confirm the meeting point before completing your swap."}
            </p>
          </div>
        ) : (
          <>
            {hasMore && (
              <div ref={topSentinelRef} className="flex justify-center py-2.5">
                <Loader2 className="animate-spin text-indigo-500" size={16} />
              </div>
            )}
            {messages.map((msg, index) => {
              const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
              const isMe = senderId === user._id;
              const previousMessage = messages[index - 1];
              const previousSenderId = previousMessage
                ? (typeof previousMessage.sender === "object" ? previousMessage.sender._id : previousMessage.sender)
                : null;
              const isFirstInGroup = previousSenderId !== senderId;
              const messageDate = new Date(msg.createdAt);
              const previousDate = previousMessage ? new Date(previousMessage.createdAt) : null;
              const showDate = !previousDate || messageDate.toDateString() !== previousDate.toDateString();

              return (
                <React.Fragment key={msg._id || index}>
                  {showDate && (
                    <div className="flex items-center gap-3 my-5 first:mt-0">
                      <span className="h-px flex-1 bg-slate-200/70"></span>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-white border border-slate-200 rounded-full px-3 py-1">
                        {messageDate.toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                      <span className="h-px flex-1 bg-slate-200/70"></span>
                    </div>
                  )}
                  <div
                    className={`flex ${isMe ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-3" : "mt-1"}`}
                  >
                    <div
                      className={`max-w-[82%] sm:max-w-[72%] px-3.5 py-2.5 ${
                        isMe
                          ? `bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.16)] ${isFirstInGroup ? "rounded-2xl rounded-tr-md" : "rounded-2xl"}`
                          : `bg-white border border-slate-200/80 text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.04)] ${isFirstInGroup ? "rounded-2xl rounded-tl-md" : "rounded-2xl"}`
                      }`}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed font-medium break-words whitespace-pre-wrap">{msg.message}</p>
                      <span
                        className={`text-[9px] mt-1.5 block font-bold text-right ${isMe ? "text-indigo-100/80" : "text-slate-400"}`}
                      >
                        {messageDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            
            {/* Typing Indicator */}
            {otherTypers.length > 0 && (
              <div className="flex justify-start mt-3">
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm flex items-center gap-1.5 w-fit">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area / Read-Only Banner */}
      {!matchDetails || matchDetails.status === 'ACTIVE' ? (
        <form
          onSubmit={handleSendMessage}
          className="px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-xl border-t border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message your swap partner..."
              className="min-w-0 flex-1 h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/70 rounded-2xl px-4 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200"
              disabled={isLoading}
              maxLength={1000}
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending || isLoading}
              className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-750 text-white rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center cursor-pointer"
              aria-label="Send message"
            >
              {isSending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} className="ml-0.5 stroke-[2.5]" />
              )}
            </button>
          </div>
          <p className="text-[9px] text-slate-400 font-semibold text-center mt-2">
            Confirm payment only after meeting your swap partner.
          </p>
        </form>
      ) : (
        <div className="px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom)+0.5rem)] bg-slate-50 border-t border-slate-100 text-center flex flex-col items-center justify-center gap-1.5 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 font-bold text-xs">
            <AlertCircle size={14} className="text-slate-400" />
            <span>Chat History is Read-Only</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            This swap has been {matchDetails.status === 'COMPLETED' ? 'completed' : 'cancelled'}. You cannot send new messages.
          </p>
        </div>
      )}
      {showReportModal && (
        <ReportModal
          matchId={matchId}
          partner={otherUser}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}

export default Chat;
