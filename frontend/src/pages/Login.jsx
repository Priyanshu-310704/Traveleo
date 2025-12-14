import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import Brand from "../components/Brand";

const Login = () => {
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
          Welcome Back
        </h2>
        <p className="text-center text-green-100 mt-2 mb-6">
          Login to continue managing your trips
        </p>

        {/* EMAIL */}
        <div className="relative mb-4">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-6">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* LOGIN BUTTON */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
        >
          Login
        </motion.button>

        {/* SIGNUP LINK */}
        <p className="text-center text-sm text-green-100 mt-5">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
