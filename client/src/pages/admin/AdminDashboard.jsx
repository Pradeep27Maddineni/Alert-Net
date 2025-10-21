import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0, incidents: 0 });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get("https://alertnet-backend-mnnu.onrender.com/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      }
    };

    fetchStats();
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-2xl text-gray-700 font-semibold">Total Users</h2>
          <p className="text-4xl font-bold text-blue-600">{stats.users}</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-2xl text-gray-700 font-semibold">Total Incidents</h2>
          <p className="text-4xl font-bold text-red-600">{stats.incidents}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold"
        >
          Manage Top Reporters
        </button>

        <button
          onClick={() => navigate("/admin/incidents")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold"
        >
          View All Incidents
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
