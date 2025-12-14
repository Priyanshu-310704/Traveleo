import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import Brand from "../components/Brand";

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-green-500 flex flex-col items-center justify-center px-4">
      {/* BRAND ABOVE CARD */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <Brand light size="xl" />
      </motion.div>

      {/* GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        <h2 className="text-2xl font-bold text-center text-white">
          Create Account
        </h2>
        <p className="text-center text-green-100 mt-2 mb-6">
          Start planning smarter trips
        </p>

        {/* Full Name */}
        <div className="relative mb-3">
          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Full name"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Phone Number */}
        <div className="relative mb-3">
          <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="tel"
            placeholder="Phone number"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Email */}
        <div className="relative mb-3">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Password */}
        <div className="relative mb-5">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
        >
          Sign Up
        </motion.button>

        <p className="text-center text-sm text-green-100 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
