import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Profile = () => {
  const { user, token, login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setPreview(user.avatar.startsWith("http") ? user.avatar : `https://alert-net.onrender.com${user.avatar}`);
    }
  }, [user?.avatar]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      if (avatar) form.append("avatar", avatar);

      const res = await axios.put(`https://alertnet-backend-mnnu.onrender.com/api/users/update`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update global context with new user data
      login(res.data.user, token);

      // Update local avatar preview from backend response (after upload)
      const newAvatar = res.data.user.avatar;
      setPreview(newAvatar.startsWith("http") ? newAvatar : `https://alertnet-backend-mnnu.onrender.com${newAvatar}`);

      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-700 flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-lg hover:shadow-yellow-300/80 transition-shadow">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">My Profile</h2>

        {message && (
          <div className="mb-4 text-center text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        {preview && (
          <div className="flex justify-center mb-6">
            <img
              src={preview}
              alt="Avatar Preview"
              className="w-24 h-24 object-cover rounded-full border-2 border-blue-400 shadow"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-1 px-3 py-1 text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
