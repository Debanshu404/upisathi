import { createContext, useContext, useEffect, useRef, useState } from "react";
import { connectSocket } from "../services/socket";
import { userContext } from "./UserContext";

export const socketContext = createContext();

function SocketContext({ children }) {
  const { user } = useContext(userContext);
  const socketRef = useRef(connectSocket());
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("SocketContext: Socket connected successfully, ID:", socket.id);
      setIsOnline(true);
    };
    
    const handleDisconnect = (reason) => {
      console.log("SocketContext: Socket disconnected, Reason:", reason);
      setIsOnline(false);
    };

    const handleConnectError = (error) => {
      console.error("SocketContext: Socket connection error:", error.message || error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // Initial state
    if (socket.connected) {
      setIsOnline(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  // React to user session changes
  useEffect(() => {
    const socket = socketRef.current;
    if (user) {
      console.log("SocketContext: User logged in, initiating socket connection...");
      socket.connect();
    } else {
      console.log("SocketContext: No active user session, disconnecting socket...");
      socket.disconnect();
    }
  }, [user]);

  return (
    <socketContext.Provider value={{ socket: socketRef, isOnline }}>
      {children}
    </socketContext.Provider>
  );
}

export default SocketContext;
