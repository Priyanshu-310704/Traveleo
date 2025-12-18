import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Brand from "../components/Brand";
import { loginUser, verifyOtp, resendOtp } from "../api/auth.api";

const Login = () => {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("LOGIN"); // LOGIN | OTP
  const [userId, setUserId] = useState(null);

  const [otpTimer, setOtpTimer] = useState(300); // 5 min
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (res.data.otpRequired) {
        setUserId(res.data.userId); // ✅ FIX
        setStep("OTP");
        setOtpTimer(300);
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifyOtp({
        userId, // ✅ FIX
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResendOtp = async () => {
    try {
      await resendOtp({ userId }); // ✅ FIX
      setOtpTimer(300);
    } catch {
      setError("Failed to resend OTP");
    }
  };

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (step !== "OTP") return;
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, otpTimer]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-green-500 flex flex-col items-center justify-center px-4">
      {/* BRAND */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <Brand light size="xl" />
      </motion.div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        <h2 className="text-2xl font-bold text-center text-white">
          {step === "LOGIN" ? "Welcome Back" : "Verify OTP"}
        </h2>

        <p className="text-center text-green-100 mt-2 mb-6">
          {step === "LOGIN"
            ? "Login to continue managing your trips"
            : "Enter the OTP sent to your email"}
        </p>

        {/* ERROR */}
        {error && (
          <p className="mb-4 text-sm text-red-200 text-center">{error}</p>
        )}

        {/* ================= LOGIN FORM ================= */}
        {step === "LOGIN" && (
          <>
            {/* EMAIL */}
            <div className="relative mb-4">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative mb-6">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/80 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* LOGIN BTN */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              {loading ? "Sending OTP..." : "Login"}
            </motion.button>
          </>
        )}

        {/* ================= OTP FORM ================= */}
        {step === "OTP" && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full text-center tracking-widest text-lg mb-4 px-4 py-3 rounded-xl bg-white/80 outline-none"
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </motion.button>

            <div className="text-center mt-4 text-sm text-green-100">
              {otpTimer > 0 ? (
                <p>
                  Resend OTP in {Math.floor(otpTimer / 60)}:
                  {String(otpTimer % 60).padStart(2, "0")}
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="underline font-semibold"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}

        {/* SIGNUP LINK */}
        {step === "LOGIN" && (
          <p className="text-center text-sm text-green-100 mt-5">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-semibold underline">
              Sign up
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
