import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const IncidentsByState = () => {
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams.get("state");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://alertnet-backend-mnnu.onrender.com/api/users/by-state?state=${encodeURIComponent(stateParam)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIncidents(res.data.incidents);
      } catch (err) {
        console.error("❌ Error fetching incidents by state:", err.response?.data || err.message);
        toast.error("❌ Failed to fetch incidents for this state.");
      } finally {
        setLoading(false);
      }
    };

    if (stateParam) {
      fetchIncidents();
    } else {
      toast.error("⚠️ No state specified for search.");
      setLoading(false);
    }
  }, [stateParam, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-red-500 underline decoration-red-400 underline-offset-4">
        Incidents in {stateParam || "Unknown State"}
      </h2>

      {loading ? (
        <p className="text-center text-lg animate-pulse text-slate-300">Loading...</p>
      ) : incidents.length === 0 ? (
        <p className="text-center text-lg text-slate-400">No incidents found for this state.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {incidents.map((incident) => (
            <div
              key={incident._id}
              className="bg-slate-800/80 rounded-2xl p-5 shadow-lg border border-slate-700 transition-transform transform hover:-translate-y-1 hover:scale-105 hover:shadow-blue-500/80"
            >
              <h3 className="text-xl font-bold capitalize text-red-400">{incident.type}</h3>
              <p className="text-base text-gray-300 mt-2">{incident.description}</p>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold text-red-300">State:</span> <span className="text-white">{incident.state || "N/A"}</span>
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {incident.imageURLs.slice(0, 3).map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="Incident"
                    className="w-24 h-24 object-cover rounded-lg border border-slate-600 shadow"
                  />
                ))}
              </div>
              <p className="text-md text-white mt-2">
               <span className="text-lg text-red-300">Reported at:</span>  {new Date(incident.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentsByState;
