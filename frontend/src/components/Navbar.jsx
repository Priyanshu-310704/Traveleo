import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Brand from "./Brand";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLink = (path) => {
    const isActive = location.pathname === path;
    return `
      px-3 py-2 rounded-md text-sm font-medium transition
      ${
        isActive
          ? "text-emerald-700 font-semibold border-b-2 border-emerald-600"
          : "text-slate-600 hover:text-emerald-600"
      }
    `;
  };

  // ✅ LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔑 clear JWT
    navigate("/login"); // 🔁 redirect
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        sticky top-0 z-50 w-full
        backdrop-blur-xl
        bg-emerald-50/70
        border-b border-emerald-100
        shadow-sm
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* BRAND */}
        <Brand size="md" />

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className={navLink("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/trips" className={navLink("/trips")}>
            Trips
          </Link>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="
            px-4 py-2 rounded-lg text-sm font-semibold
            text-red-600
            hover:bg-red-100
            transition
          "
        >
          Logout
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
