import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminIncidents = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  //This hook executes immediately after the component mounts and handles the security check and data fetching.
  useEffect(() => {
    //Authorization Check
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    //Data Fetching
    const fetchIncidents = async () => {
      try {
        const res = await axios.get("https://alert-net.onrender.com/api/admin/incidents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIncidents(res.data.incidents);
      } catch (err) {
        console.error("Failed to fetch incidents", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [token, user, navigate]);

  if (loading) return <div className="p-6">Loading incidents...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-red-700">All Reported Incidents</h1>
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Title</th>
              <th className="p-2">Description</th>
              <th className="p-2">Reporter</th>
              <th className="p-2">Location</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, i) => (
              <tr key={incident._id} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2 font-medium text-blue-600">{incident.type}</td>
                <td className="p-2 text-sm">{incident.description}</td>
                <td className="p-2 text-sm">{incident.reporter?.name || "N/A"}<br /><span className="text-xs text-gray-500">{incident.reporter?.email}</span></td>
                <td className="p-2 text-sm">
                  {incident.locationName || `(${incident.location?.coordinates?.join(", ")})`}
                </td>
                <td className="p-2 text-sm">{new Date(incident.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminIncidents;
/*
The AdminIncidents component is a secure administrative tool that:
Guards its content against non-admin users.
Fetches a comprehensive list of all reported incidents from the backend.
Presents the data in a clear, organized table format for easy review by the administrator.
*/