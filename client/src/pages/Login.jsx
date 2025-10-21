import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import img1 from "../assets/img2.png";
import img2 from "../assets/img3.png";
import img3 from "../assets/img4.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setLoading(true);
  try {
    const res = await axios.post("https://alertnet-backend-mnnu.onrender.com/api/auth/login", {
      ...formData,
      isAdmin,
    });

    const { user, token } = res.data;

    if (isAdmin && user.role !== "admin") {
      setMessage("❌ You are not authorized as an admin.");
      return;
    }

    login(user, token);

    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    setMessage(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-yellow-200 to-blue-300 px-4">
      {/* Left Side */}
      <div className="md:w-1/2 flex flex-col justify-center items-center text-center p-8 space-y-6">
        <h1 className="text-3xl font-bold text-blue-800">Welcome Back!</h1>
        <p className="text-gray-700 max-w-md">
          Join a growing network of people helping each other. Reporting incidents saves lives,
          prevents crime, and builds safer communities.
        </p>
        <p className="italic text-red-600 font-semibold">
          "Stay aware. Stay safe."
        </p>
        <div className="flex gap-4 ">
          <img src={img1} alt="incident1" className="w-24 h-24 rounded shadow hover:shadow-black/90" />
          <img src={img2} alt="incident2" className="w-24 h-24 rounded shadow hover:shadow-black/90" />
          <img src={img3} alt="incident3" className="w-24 h-24 rounded shadow hover:shadow-black/90" />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/60 p-8 rounded-xl shadow-xl hover:shadow-red-400/80 border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
            Login to <span className="text-red-600">AlertNet</span>
          </h2>

          {message && <p className="mb-4 text-red-500 text-center">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@gmail.com"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter the Password"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="mr-2"
              />
              <label htmlFor="isAdmin" className="text-sm text-gray-700">
                Login as Admin
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
