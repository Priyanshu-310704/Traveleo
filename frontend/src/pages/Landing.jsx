import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Brand from "../components/Brand";
import { FiPieChart, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import FooterLanding from "../components/FooterLanding";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0F172A] via-[#0B3C3A] to-[#064E3B] text-white">

      {/* HERO SECTION */}
      <section className="flex-grow flex items-center px-6 lg:px-20 py-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* LOGO */}
            <div className="mb-8">
              <Brand light size="lg" />
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
              Smarter travel
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                budgeting & expenses
              </span>
            </h1>

            <p className="mt-6 text-lg text-white/70 max-w-xl">
              TraveLeo helps you plan trips, track every expense, and stay within
              budget — all in one clean, intuitive dashboard designed for
              stress-free travel.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold shadow-lg shadow-emerald-500/30 hover:brightness-110 transition">
                  Get Started Free
                </button>
              </Link>

              <Link to="/login">
                <button className="px-8 py-4 rounded-xl border border-white/30 text-white/90 hover:bg-white/10 transition">
                  Login
                </button>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT GLASS PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Feature
                icon={<FiDollarSign />}
                title="Expense Tracking"
                desc="Log every travel expense in seconds"
              />
              <Feature
                icon={<FiPieChart />}
                title="Smart Categories"
                desc="Clear insights into where your money goes"
              />
              <Feature
                icon={<FiTrendingUp />}
                title="Budget Insights"
                desc="Stay in control with real-time budget views"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <FooterLanding />
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="rounded-2xl bg-white/10 border border-white/20 p-6 text-center hover:bg-white/15 transition">
    <div className="text-3xl text-emerald-400 mb-3">
      {icon}
    </div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-white/60 mt-1">{desc}</p>
  </div>
);

export default Landing;
