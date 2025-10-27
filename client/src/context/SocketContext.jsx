import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, loading } = useContext(AuthContext); // 👈 include loading if available
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL || "https://alertnet-backend-mnnu.onrender.com",
      {
        transports: ["websocket", "polling"], // fallback for Render
        withCredentials: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      }
    );

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // ✅ Wait until user is ready (not null)
    if (user && user._id) {
      console.log("✅ Joining user room:", user._id);
      socket.emit("joinChatRoom", user._id);
    } else {
      console.warn("⚠️ User not ready yet, retrying join...");
      // Optional retry after small delay
      const timer = setTimeout(() => {
        if (user && user._id) {
          console.log("🔁 Retrying join:", user._id);
          socket.emit("joinChatRoom", user._id);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
