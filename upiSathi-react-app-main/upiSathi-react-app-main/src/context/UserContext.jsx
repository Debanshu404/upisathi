import { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser } from "../services/api";
import { socketContext } from "./SocketContext";

export const userContext = createContext();

function UserContext({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        // Extract user object from standard response format { success, message, data }
        setUser(response.data || response);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, loading }}>
      {children}
    </userContext.Provider>
  );
}

export default UserContext;
