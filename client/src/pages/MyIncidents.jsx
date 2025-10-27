import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyIncidents = () => {
  const { token } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIncidents = async () => {
      try {
        const res = await axios.get("https://alert-net.onrender.com/api/incidents/my-incidents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIncidents(res.data.incidents);
      } catch (err) {
        console.error("❌ Failed to fetch incidents:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyIncidents();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-lg">Loading your incidents...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-red-400 mb-10 drop-shadow-md">
          📋 My Reported Incidents
        </h1>

        {incidents.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">You haven't reported any incidents yet.</p>
        ) : (
          <div className="grid grid-cols-1   md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidents.map((incident) => (
              <Link
                key={incident._id}
                to={`/incident/${incident._id}`}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg shadow-white/90 hover:shadow-blue-400/90 transition-all duration-300"
              >
                <h2 className="text-xl font-bold text-red-300 mb-2 capitalize">{incident.type}</h2>
                <p className="text-sm text-gray-300 mb-3">
                  {incident.description.length > 100
                    ? incident.description.slice(0, 100) + "..."
                    : incident.description}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="font-medium text-white">Reported On:</span>{" "}
                  {new Date(incident.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-green-400 mt-1 capitalize">
                  <span className="font-medium text-white">Status:</span> {incident.status}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIncidents;
