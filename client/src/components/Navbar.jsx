import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-slate-500 text-white shadow-md w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          AlertNet 🚨
        </Link>

        {/* Desktop Links */}
        <div className="hidden  sm:flex flex-wrap items-center gap-6 text-sm md:text-base">
          {!token ? (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
            </>
          ) : isAdmin ? (
            <>
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/admin/users" className="hover:underline">Manage Users</Link>
              <Link to="/admin/incidents" className="hover:underline">All Incidents</Link>
              <Link to="/admin/report-incident" className="hover:underline text-yellow-300 font-medium">➕ Upload Incident</Link>
              <span className="font-semibold">👤 {user?.name || "Admin"}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 font-medium px-3 py-1 rounded hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/report" className="hover:underline">Report Incident</Link>
              <Link to="/notifications" className="hover:underline">Notifications</Link>
              <Link to="/my-incidents" className="hover:underline">My Incidents</Link>
             <Link to="/chat-inbox" className="hover:underline">Chat Inbox</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <span className="font-semibold">👤 {user?.name || "User"}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 font-medium px-3 py-1 rounded hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Icon & Logout */}
        <div className="sm:hidden flex items-center gap-3">
          {token && (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 text-sm font-semibold px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              Logout
            </button>
          )}
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && token && (
        <div className="sm:hidden  bg-gradient-to-br from-blue-100 to-red-200 text-white absolute w-full flex  justify-center items-center  shadow-lg z-40">
          <div className="flex flex-col items-start gap-3 px-6 py-4 text-sm ">
            {isAdmin ? (
              <>
                <Link   className="border bg-white text-black rounded text-lg  w-40  text-center"   to="/admin/dashboard" onClick={toggleMenu}>Dashboard</Link>
                <Link  className="border bg-white text-black rounded text-lg  w-40  text-center"  to="/admin/users" onClick={toggleMenu}>Manage Users</Link>
                <Link  className="border bg-white text-black rounded text-lg  w-40  text-center"  to="/admin/incidents" onClick={toggleMenu}>All Incidents</Link>
                <Link   className="border bg-white text-black rounded text-lg  w-40  text-center" to="/admin/report-incident" onClick={toggleMenu}>Upload Incident</Link>
              </>
            ) : (
              <> 
                <Link className="border bg-white text-black rounded text-lg  w-40  text-center" to="/dashboard" onClick={toggleMenu}>Dashboard</Link>
                <Link className="border bg-white text-black rounded text-lg w-40 text-center"  to="/report" onClick={toggleMenu}>Report Incident</Link>
                <Link className="border bg-white text-black rounded text-lg w-40 text-center"  to="/notifications" onClick={toggleMenu}>Notifications</Link>
                <Link className="border bg-white text-black rounded text-lg w-40 text-center"  to="/my-incidents" onClick={toggleMenu}>My Incidents</Link>
                
                <Link  className="border bg-white text-black rounded text-lg w-40 text-center"  to="/chat-inbox"  onClick={toggleMenu}>Chat Inbox</Link>
                <Link  className="border bg-white text-black rounded text-lg w-40 text-center"  to="/profile" onClick={toggleMenu}>Profile</Link>
 
              </>
            )}
            <span  className="font-semibold text-black text-lg">👤 {user?.name || "User"}</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
