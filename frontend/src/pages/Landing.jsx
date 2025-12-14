import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Brand from "../components/Brand";
import { FiPieChart, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import FooterLanding from "../components/FooterLanding";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-green-500 flex flex-col px-4">

      {/* MAIN CONTENT */}
      <div className="flex-grow flex flex-col items-center justify-center">

        {/* BRAND */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Brand light size="lg" />
        </motion.div>

        {/* MAIN GLASS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Plan Smarter. Travel Better.
          </h1>

          <p className="text-green-100 mt-4 text-lg max-w-2xl mx-auto">
            TraveLeo helps you plan trips, track expenses, and stay within your
            budget — effortlessly.
          </p>

          <p className="text-green-200 mt-2 text-sm">
            Designed for stress-free travel planning.
          </p>

          {/* FEATURES */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
            <div className="flex flex-col items-center bg-white/10 rounded-2xl p-5">
              <FiDollarSign className="text-3xl mb-3 text-green-200" />
              <h3 className="font-semibold">Track Expenses</h3>
              <p className="text-sm text-green-100 text-center mt-1">
                Record every travel expense easily
              </p>
            </div>

            <div className="flex flex-col items-center bg-white/10 rounded-2xl p-5">
              <FiPieChart className="text-3xl mb-3 text-green-200" />
              <h3 className="font-semibold">Categorize Spending</h3>
              <p className="text-sm text-green-100 text-center mt-1">
                Food, travel, stay & more
              </p>
            </div>

            <div className="flex flex-col items-center bg-white/10 rounded-2xl p-5">
              <FiTrendingUp className="text-3xl mb-3 text-green-200" />
              <h3 className="font-semibold">Budget Insights</h3>
              <p className="text-sm text-green-100 text-center mt-1">
                Get smart budget alerts
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/signup">
              <button className="px-10 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition text-lg w-full sm:w-auto">
                Get Started
              </button>
            </Link>

            <Link to="/login">
              <button className="px-8 py-4 rounded-xl border border-white/50 text-white font-semibold hover:bg-white/10 transition w-full sm:w-auto">
                Login
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* FOOTER AT BOTTOM */}
      <FooterLanding />
    </div>
  );
};

export default Landing;
