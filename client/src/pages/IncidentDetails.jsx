import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const IncidentDetails = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || id === "undefined") return;

    const fetchIncident = async () => {
      try {
        const res = await axios.get(`https://alertnet-backend-mnnu.onrender.com/api/incidents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIncident(res.data.incident);
      } catch (err) {
        console.error("❌ Failed to load incident:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id, user, token]);

  if (loading)
    return <p className="text-center p-6 text-lg font-medium">Loading...</p>;

  if (!incident)
    return <p className="text-center p-6 text-red-600 text-lg font-semibold">Incident not found</p>;

  const coordinates = incident.location?.coordinates || [];

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-slate-800 text-white rounded-xl shadow-lg shadow-yellow-300/90 hover:shadow-blue-500/90 p-6 sm:p-8">
       

        <h2 className="text-3xl font-bold mb-6 text-center text-red-500">🚨 Incident Details</h2>

        <div className="space-y-4 text-base">
          <p>
            <span className="font-semibold text-gray-200">Type:</span>{" "}
            <span className="text-red-400 font-bold text-lg">{incident.type}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-200">Description:</span>{" "}
            <span className="text-red-400 font-bold text-lg">{incident.description}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-200">Coordinates:</span>{" "}
            <span className="text-red-400 font-bold text-lg">{coordinates.join(", ") || "N/A"}</span>
          </p>
          <p className="text-sm text-gray-400">
            Reported At: {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>

        {incident.imageURLs?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3 text-lg text-gray-200">Uploaded Images:</h3>
            <div className="flex gap-3 overflow-x-auto">
              {incident.imageURLs.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`incident-${idx}`}
                  className="w-32 h-32 object-cover rounded-md border border-gray-600 shadow"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentDetails;
