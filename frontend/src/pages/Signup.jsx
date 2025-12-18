import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import Brand from "../components/Brand";
import { registerUser } from "../api/auth.api";

const Signup = () => {
  const navigate = useNavigate();

  /* STATE */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // UI only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* TOAST STATE */
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSignup = async () => {
    setLoading(true);

    try {
      await registerUser({ name, email, password });

      showToast(
        "success",
        "Account created successfully! Redirecting to login…"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.error || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-6
        bg-gradient-to-br from-[#0F172A] via-[#0B3C3A] to-[#064E3B]
        text-white
      "
    >
      {/* TOAST */}
      {toast && (
        <Toast type={toast.type} message={toast.message} />
      )}

      {/* MAIN CONTAINER */}
      <div
        className="
          w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2
          rounded-3xl overflow-hidden
          bg-white/5 backdrop-blur-2xl
          border border-white/15
          shadow-[0_40px_120px_rgba(0,0,0,0.45)]
        "
      >
        {/* LEFT PANEL — BRAND */}
        <div
          className="
            hidden lg:flex flex-col justify-between p-12
            bg-gradient-to-br from-[#0B1220]/80 via-[#0E1F2A]/80 to-[#0A2E2A]/80
            border-r border-white/10
          "
        >
          <div>
            <Link to="/" className="inline-block">
              <Brand light size="lg" />
            </Link>

            <h2 className="mt-10 text-3xl font-semibold leading-tight">
              Plan travel smarter.
              <span
                className="
                  block mt-2
                  bg-gradient-to-r from-emerald-400 to-teal-400
                  bg-clip-text text-transparent
                "
              >
                Spend with confidence.
              </span>
            </h2>

            <p className="mt-5 text-white/65 max-w-sm">
              TraveLeo helps you track expenses, manage budgets,
              and enjoy stress-free journeys.
            </p>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} TraveLeo
          </p>
        </div>

        {/* RIGHT PANEL — FORM */}
        <div className="p-8 sm:p-12">
          {/* MOBILE LOGO */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/">
              <Brand light size="lg" />
            </Link>
          </div>

          <h3 className="text-2xl font-semibold">
            Create your account
          </h3>
          <p className="text-white/60 mt-2 mb-8">
            Get started in less than a minute
          </p>

          <div className="space-y-4">
            <Input icon={<FiUser />} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input icon={<FiPhone />} placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input icon={<FiMail />} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />

            {/* PASSWORD */}
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full pl-12 pr-12 py-3 rounded-xl
                  bg-white/10 border border-white/20
                  text-white placeholder-white/40
                  outline-none focus:ring-2 focus:ring-emerald-400
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-emerald-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="
              w-full mt-8 py-3 rounded-xl
              bg-gradient-to-r from-emerald-500 to-teal-500
              font-semibold shadow-lg shadow-emerald-500/30
              hover:brightness-110 transition
            "
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-sm text-white/60 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
              Login
            </Link>
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
      className="
        w-full pl-12 pr-4 py-3 rounded-xl
        bg-white/10 border border-white/20
        text-white placeholder-white/40
        outline-none focus:ring-2 focus:ring-emerald-400
      "
    />
  </div>
);

/* TOAST */
const Toast = ({ type, message }) => {
  const isSuccess = type === "success";

  return (
    <div
      className="
        fixed top-6 right-6 z-50
        animate-slide-in
      "
    >
      <div
        className={`
          flex items-center gap-3 px-5 py-4 rounded-2xl
          backdrop-blur-xl border
          shadow-2xl
          ${isSuccess
            ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200"
            : "bg-red-500/15 border-red-400/30 text-red-200"}
        `}
      >
        {isSuccess ? (
          <FiCheckCircle className="text-xl" />
        ) : (
          <FiAlertTriangle className="text-xl" />
        )}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
};

export default Signup;
