import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";
import Brand from "../components/Brand";
import { loginUser, verifyOtp, resendOtp } from "../api/auth.api";

const Login = () => {
  const navigate = useNavigate();

  /* STATE (UNCHANGED LOGIC) */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("LOGIN");
  const [userId, setUserId] = useState(null);
  const [otpTimer, setOtpTimer] = useState(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* 🔔 TOAST STATE (ADDED) */
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.data.otpRequired) {
        setUserId(res.data.userId);
        setStep("OTP");
        setOtpTimer(300);
        showToast("info", "OTP sent to your email");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      setError(msg);
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({ userId, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      showToast("success", "Login successful");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch {
      setError("Invalid OTP");
      showToast("error", "Invalid OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ userId });
      setOtpTimer(300);
      showToast("info", "OTP resent successfully");
    } catch {
      setError("Failed to resend OTP");
      showToast("error", "Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (step !== "OTP" || otpTimer <= 0) return;
    const timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-[#0F172A] via-[#0B3C3A] to-[#064E3B] text-white">

      {/* 🔔 TOAST (ADDED) */}
      {toast && <Toast {...toast} />}

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/15 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">

        {/* LEFT PANEL — FORM */}
        <div className="p-8 sm:p-12">
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/">
              <Brand light size="lg" />
            </Link>
          </div>

          <h3 className="text-2xl font-semibold text-center lg:text-left">
            {step === "LOGIN" ? "Welcome back" : "Verify OTP"}
          </h3>

          <p className="text-white/60 mt-2 mb-8 text-center lg:text-left">
            {step === "LOGIN"
              ? "Login to continue managing your trips"
              : "Enter the OTP sent to your email"}
          </p>

          {error && (
            <p className="mb-4 text-sm text-red-400 text-center lg:text-left">
              {error}
            </p>
          )}

          {step === "LOGIN" && (
            <div className="space-y-4">
              <Input
                icon={<FiMail />}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-emerald-400 transition"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold shadow-lg shadow-emerald-500/30 hover:brightness-110 transition"
              >
                {loading ? "Sending OTP..." : "Login"}
              </button>
            </div>
          )}

          {step === "OTP" && (
            <div>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full text-center py-3 rounded-xl bg-white/10 border border-white/20 text-white tracking-widest mb-4 outline-none"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold"
              >
                Verify OTP
              </button>

              <div className="mt-4 text-sm text-white/60 text-center">
                {otpTimer > 0 ? (
                  <p>
                    Resend OTP in {Math.floor(otpTimer / 60)}:
                    {String(otpTimer % 60).padStart(2, "0")}
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-emerald-400 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {step === "LOGIN" && (
            <p className="text-sm text-white/60 mt-6 text-center lg:text-left">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-emerald-400 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </div>

        {/* RIGHT PANEL — BRAND / CONTEXT */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0B1220]/80 via-[#0E1F2A]/80 to-[#0A2E2A]/80 border-l border-white/10">
          <div>
            <Link to="/" className="inline-block">
              <Brand light size="lg" />
            </Link>

            <h2 className="mt-10 text-3xl font-semibold leading-tight">
              Welcome back.
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Continue your journey.
              </span>
            </h2>

            <p className="mt-5 text-white/65 max-w-sm">
              Access your trips, track expenses, and stay in control
              of your travel budget with TraveLeo.
            </p>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} TraveLeo
          </p>
        </div>
      </div>
    </div>
  );
};

/* INPUT */
const Input = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
      {icon}
    </span>
    <input
      {...props}
      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-emerald-400"
    />
  </div>
);

/* 🔔 TOAST COMPONENT */
const Toast = ({ type, message }) => {
  const styles = {
    success: "border-emerald-400 text-emerald-300 shadow-emerald-500/30",
    error: "border-red-400 text-red-300 shadow-red-500/30",
    info: "border-teal-400 text-teal-300 shadow-teal-500/30",
  };

  const icons = {
    success: <FiCheckCircle />,
    error: <FiAlertTriangle />,
    info: <FiInfo />,
  };

  return (
    <div className={`fixed top-6 right-6 z-50 px-5 py-4 rounded-xl backdrop-blur-xl bg-black/60 border ${styles[type]} shadow-lg flex gap-3 items-center`}>
      {icons[type]}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Login;
