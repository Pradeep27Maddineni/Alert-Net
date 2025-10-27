import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import toast from "react-hot-toast";
import IndiaMap from "../assets/indiamap.png";

const ReportIncidentForm = () => {
  const { token } = useContext(AuthContext);
  const { fetchNotifications } = useContext(NotificationContext);
  const [type, setType] = useState("theft");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState("");
  const navigate = useNavigate();

  const getCoordinatesFromLocation = async () => {
    try {
      const query = location.toLowerCase().includes("india")
        ? location
        : `${location}, India`;

      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          query
        )}&key=b1412fa22d924ac9873ea5d5522de2c6`
      );

      if (!res.data.results || res.data.results.length === 0) {
        toast.error("❌ Location not found. Try a more specific place.");
        throw new Error("No location results");
      }

      const { lat, lng } = res.data.results[0].geometry;
      return [lng, lat];
    } catch (error) {
      console.error("Geocoding failed:", error.message);
      toast.error("❌ Failed to get coordinates");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("⚠️ You must be logged in to report an incident.");
    if (!description || images.length === 0 || !location) {
      return toast.error("⚠️ Please fill all fields and upload at least one image.");
    }

    setLoading(true);

    try {
      const coords = await getCoordinatesFromLocation();
      setCoordinates(coords);

      const base64Images = await Promise.all(
        Array.from(images).map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );

      await axios.post(
        "https://alertnet-backend-mnnu.onrender.com/api/incidents/upload",
        {
          type,
          description,
          location,
          coordinates: coords,
          base64Images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Incident reported successfully!");
      setType("theft");
      setDescription("");
      setLocation("");
      setImages([]);
      setCoordinates([0, 0]);

      if (fetchNotifications) await fetchNotifications();
    } catch (err) {
      console.error("Error reporting incident:", err.response?.data || err.message);
      toast.error("❌ Failed to report incident. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStateSearch = () => {
    if (!searchState.trim()) return toast.error("⚠️ Enter a state name.");
    toast.success(`🔎 Searching incidents in ${searchState}...`);
    navigate(`/incidents?state=${encodeURIComponent(searchState.trim())}`);
  };

  return (
    <div className="bg-slate-900 text-white flex flex-col md:flex-row gap-8 px-4 py-8">
      {/* LEFT SIDE: MAP & SEARCH */}
      <div className="md:w-1/2 flex flex-col items-center justify-start gap-4">
        <div className="w-1/2 justify-center flex gap-2">
          <input
            type="text"
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
            placeholder="Search state (e.g. Andhra Pradesh)"
            className="flex-1 p-2 rounded-lg bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            onClick={handleStateSearch}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
          >
            Search
          </button>
        </div>

        <img
          src={IndiaMap}
          alt="India Map"
          className="w-full max-w-md rounded-xl shadow-lg shadow-blue-400/80"
        />
      </div>

      {/* RIGHT SIDE: FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col backdrop-blur-md bg-slate-800 text-white shadow-lg shadow-yellow-500/90 hover:shadow-blue-400/90 border border-slate-600 rounded-2xl p-6 w-full md:mr-[3%] md:ml-auto md:w-[35%]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center underline text-red-500">
          Report an Incident
        </h2>

        <label className="font-semibold mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 rounded-lg border bg-slate-700 text-white mb-4"
        >
          <option value="theft">Theft</option>
          <option value="accident">Accident</option>
          <option value="murder">Murder</option>
          <option value="fire">Fire</option>
          <option value="fight">Fight</option>
          <option value="other">Other</option>
        </select>

        <label className="font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what happened..."
          className="w-full p-2 rounded-lg border bg-slate-700 text-white mb-4 resize-none"
          rows={4}
        />

        <label className="font-semibold mb-1">Location (City/Area)</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Guntur, Andhra Pradesh"
          className="w-full p-2 rounded-lg border bg-slate-700 text-white mb-4"
        />

        <label className="font-semibold mb-1">Upload Image(s)</label>
        <div className="relative w-full mb-2">
          <input
            type="file"
            id="fileUpload"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-center shadow-md cursor-pointer">
            Choose Files
          </div>
        </div>

        {images.length > 0 && (
          <div className="mb-4 text-green-400 font-medium text-sm">
            ✅ {images.length} {images.length === 1 ? "photo" : "photos"} uploaded
          </div>
        )}

        <div className="flex justify-center mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 mt-4 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Reporting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIncidentForm;
