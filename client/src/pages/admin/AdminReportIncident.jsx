// File: src/pages/admin/AdminReportIncident.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AdminReportIncident = () => {
  const { token } = useContext(AuthContext);
  const [type, setType] = useState("theft");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("⚠️ You must be logged in as admin.");
    if (!description || images.length === 0 || !state || !coordinates[0]) {
      return toast.error("⚠️ Fill all fields and upload at least one image.");
    }

    setLoading(true);

    try {
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

      const res = await axios.post(
        "https://alertnet-backend-mnnu.onrender.com/api/admin/upload-incident",
        {
          type,
          description,
          state,
          coordinates,
          base64Images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Incident reported successfully by admin!");
      setType("theft");
      setDescription("");
      setState("");
      setCoordinates([0, 0]);
      setImages([]);
    } catch (err) {
      console.error("Admin upload failed:", err);
      toast.error("❌ Failed to upload incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center items-start py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-500 underline">
          Admin Incident Upload
        </h2>

        <label className="block mb-1 font-semibold">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 mb-4"
        >
          <option value="theft">Theft</option>
          <option value="accident">Accident</option>
          <option value="murder">Murder</option>
          <option value="fire">Fire</option>
          <option value="fight">Fight</option>
          <option value="other">Other</option>
        </select>

        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 mb-4"
          rows={4}
          placeholder="Describe the incident..."
        />

        <label className="block mb-1 font-semibold">State</label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="e.g. Andhra Pradesh"
          className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 mb-4"
        />

     <label className="block mb-1 font-semibold">Coordinates [lng, lat]</label>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="Longitude"
            className="flex-1 p-2 rounded-lg bg-slate-700 border border-slate-600"
            value={coordinates[0]}
            onChange={(e) =>
              setCoordinates([parseFloat(e.target.value), coordinates[1]])
            }
          />
          <input
            type="number"
            placeholder="Latitude"
            className="flex-1 p-2 rounded-lg bg-slate-700 border border-slate-600"
            value={coordinates[1]}
            onChange={(e) =>
              setCoordinates([coordinates[0], parseFloat(e.target.value)])
            }
          />
        </div>

        <label className="block mb-1 font-semibold">Upload Images</label>
        <div className="relative w-full mb-3">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
            className="absolute inset-0 opacity-0 z-10 cursor-pointer"
          />
          <div className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-center font-semibold shadow">
            Choose Files
          </div>
        </div>

        {images.length > 0 && (
          <p className="text-green-400 text-sm mb-4">
            ✅ {images.length} {images.length === 1 ? "image" : "images"} selected
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 py-2 px-6 rounded-lg font-bold shadow disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Incident"}
        </button>
      </form>
    </div>
  );
};

export default AdminReportIncident;
