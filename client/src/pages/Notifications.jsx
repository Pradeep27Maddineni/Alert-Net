import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Notifications = () => {
  const { notifications, fetchNotifications } = useContext(NotificationContext);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `https://alert-net.onrender.com/api/users/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        await fetchNotifications();
        toast.success("✅ Notification deleted");
      }
    } catch (err) {
      console.error("❌ Failed to delete notification:", err.message);
      toast.error("❌ Failed to delete notification");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-red-400 mb-10 drop-shadow-md">
          🔔 Your Notifications
        </h1>

        {notifications.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">
            No notifications yet. Stay alert!
          </p>
        ) : (
          <ul className="space-y-6">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className="relative bg-slate-800 border border-slate-700 rounded-xl p-6 pr-28 shadow-lg shadow-white/80 hover:shadow-yellow-300/80 transition-shadow duration-300 space-y-2"
              >
                {notif.incident ? (
                  <>
                    <Link
                      to={`/incident/${notif.incident._id}`}
                      className="block space-y-2"
                    >
                      <p className="text-xl font-semibold text-red-300">
                        {notif.message}
                      </p>
                      <p className="text-md">
                        <span className="font-semibold text-white">Type:</span>{" "}
                        <span className="text-red-400 font-medium text-lg">
                          {notif.incident.type}
                        </span>
                      </p>
                      <p className="text-md text-gray-300">
                        <span className="font-semibold text-white">
                          Reported At:
                        </span>{" "}
                        {new Date(notif.incident.createdAt).toLocaleString()}
                      </p>
                    </Link>

                    {notif.incident.reporter &&
                      notif.incident.reporter !== user._id && (
                        <button
                          onClick={() =>
                            navigate(
                              `/chat/${notif.incident._id}/${notif.incident.reporter}`
                            )
                          }
                          className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
                        >
                          🗨️ Chat with Reporter
                        </button>
                      )}
                  </>
                ) : (
                  <p className="text-red-300 text-base">{notif.message}</p>
                )}

                <button
                  onClick={() => handleDelete(notif._id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-md shadow-lg transition-all"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
