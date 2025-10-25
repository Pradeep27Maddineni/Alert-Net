import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";
import toast from "react-hot-toast";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (!token || !user || user.role !== "user") return;

    try {
      const res = await axios.get("https://alertnet-backend-mnnu.onrender.com/api/users/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token, user]);

  useEffect(() => {
    if (!socket || !user || user.role !== "user") return;

    const handleNotification = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);

      if (newNotif.type === "alert") {
        toast.success(`🚨 Nearby Incident: ${newNotif.incident?.type || "Alert"}`, {
          duration: 6000,
        });
      }

      if (newNotif.type === "self-report") {
        toast("✅ Your incident has been reported", {
          icon: "📝",
        });
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, user]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

/*
  axios.get() — fetches past notifications from REST API.
  useEffect() — runs side effects (fetch data or listen to socket events).
  useContext(AuthContext) — gets user and token.
  useContext(SocketContext) — gets live socket connection.
  toast() — displays pop-up notifications (via react-hot-toast)
*/