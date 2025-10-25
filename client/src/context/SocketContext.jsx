import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL || "https://alertnet-backend-mnnu.onrender.com", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user && user._id) {
      console.log("✅ Emitting join with userId:", user._id);
      socket.emit("join", user._id);
    } else if (socket && (!user || !user._id)) {
      console.warn("⚠️ Skipping join: user or user._id is missing");
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

/*
  SocketContext.jsx — Manages Real-Time Connection::
  io() — connects to the backend WebSocket server (from socket.io-client).
  useEffect() — creates and cleans up the connection when the component mounts/unmounts.
  emit() — sends messages/events to the server.
  useContext(AuthContext) — gets user info to tell the server which user connected.
  The SocketProvider uses two useEffect hooks:
    The first one runs once to create the socket connection using socket.io-client. It sets up the socket and cleans it up on unmount to prevent memory leaks.
    The second one runs every time either the socket or user changes. When both are available, it emits a "join" event to the backend with the user’s ID, so the server knows which user is connected.
    This design cleanly separates connection setup and user authentication, avoids unnecessary reconnections, and ensures the socket is always properly managed.
*/