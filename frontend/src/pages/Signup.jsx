import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import Brand from "../components/Brand";
import { signupUser } from "../api/auth.api";

const Signup = () => {
  const navigate = useNavigate();

  // ✅ states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // UI only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ backend-connected signup
  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      await signupUser({
        name,
        email,
        password, // ⚠️ phone NOT sent (backend doesn’t accept it)
      });

      // ✅ redirect to login after successful signup
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

        {/* ERROR */}
        {error && (
          <p className="mb-4 text-sm text-red-200 text-center">
            {error}
          </p>
        )}

        {/* Full Name */}
        <div className="relative mb-3">
          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Phone Number (UI ONLY) */}
        <div className="relative mb-3">
          <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Email */}
        <div className="relative mb-3">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Password */}
        <div className="relative mb-5">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* SIGNUP BUTTON */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
        >
          {loading ? "Creating account..." : "Sign Up"}
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
