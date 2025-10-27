import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import img1 from "../assets/img2.png";
import img2 from "../assets/img3.png";
import img3 from "../assets/img4.png";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getCoordinatesFromLocation = async (location) => {
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
        throw new Error("Location not found. Please try a more specific place.");
      }

      const { lat, lng } = res.data.results[0].geometry;
      return [lng, lat];
    } catch (err) {
      console.error("Geocoding error:", err.message);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { name, email, password, phone, location } = formData;

    if (!name || !email || !password || !phone || !location) {
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const coordinates = await getCoordinatesFromLocation(location);

      const res = await axios.post("https://alertnet-backend-mnnu.onrender.com/api/auth/register", {
        name,
        email,
        password,
        phone,
        location,
        coordinates,
      });

      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Signup failed. Check location or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-yellow-200 to-blue-300 px-4">
      {/* Left: Info Panel */}
      <div className="md:w-1/2 flex flex-col justify-center items-center text-center p-8 space-y-6">
        <h1 className="text-4xl font-bold text-blue-700">Join AlertNet Today</h1>
        <p className="text-gray-700 max-w-md text-xl">
          Every year, thousands of lives are lost due to delayed reporting of crimes and accidents.
          AlertNet helps communities stay informed and act fast.
        </p>
        <p className="italic text-red-600 font-semibold">
          "Report an incident. Save a life."
        </p>

        <div className="flex gap-4">
          <img src={img1} alt="incident1" className="w-24 h-24 rounded shadow" />
          <img src={img2} alt="incident2" className="w-24 h-24 rounded shadow" />
          <img src={img3} alt="incident3" className="w-24 h-24 rounded shadow" />
        </div>
      </div>

      {/* Right: Signup Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/60 p-8 rounded-xl shadow-2xl border border-gray-200 mt-5 mb-10">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
          <span className="text-red-500">Sign Up</span> 
          </h2>

          {message && <p className="mb-4 text-red-500 text-center">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {["name", "email", "password", "phone", "location"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  required
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "location" ? "e.g. Hyderabad, Telangana" : undefined
                  }
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition duration-200"
            >
              {loading ? "Creating account..." : "Signup"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
