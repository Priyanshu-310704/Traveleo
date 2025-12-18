import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Brand from "./Brand";
import {
  FiHome,
  FiMap,
  FiLogOut,
} from "react-icons/fi";
import { motion } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const linkClass = (active) => `
    flex items-center gap-3 px-4 py-3 rounded-xl
    text-sm font-medium transition
    ${
      active
        ? "bg-emerald-500/15 text-emerald-400"
        : "text-white/60 hover:bg-white/5 hover:text-white"
    }
  `;

  /* LOGOUT (UNCHANGED LOGIC) */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        fixed left-0 top-0 h-screen w-64
        bg-gradient-to-br from-[#0B1220] via-[#0E1F2A] to-[#0A2E2A]
        border-r border-white/10
        backdrop-blur-2xl
        px-6 py-8
        flex flex-col
      "
    >
      {/* BRAND */}
      <Link to="/dashboard" className="mb-10">
        <Brand light size="lg" />
      </Link>

      {/* NAV LINKS */}
      <nav className="flex flex-col gap-2 flex-grow">
        <Link
          to="/dashboard"
          className={linkClass(isActive("/dashboard"))}
        >
          <FiHome size={18} />
          Dashboard
        </Link>

        <Link
          to="/trips"
          className={linkClass(isActive("/trips"))}
        >
          <FiMap size={18} />
          Trips
        </Link>
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="
          mt-6 flex items-center gap-3 px-4 py-3
          rounded-xl text-sm font-semibold
          text-red-400 hover:bg-red-500/10 transition
        "
      >
        <FiLogOut size={18} />
        Logout
      </button>
    </motion.aside>
  );
};

export default Sidebar;
