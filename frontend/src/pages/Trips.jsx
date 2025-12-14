import React from 'react'
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const tripsData = [
  {
    id: 1,
    name: "Goa Vacation",
    startDate: "10 Jan 2025",
    endDate: "18 Jan 2025",
    budget: 60000,
    status: "active",
  },
  {
    id: 2,
    name: "Manali Trip",
    startDate: "5 Mar 2025",
    endDate: "12 Mar 2025",
    budget: 45000,
    status: "upcoming",
  },
  {
    id: 3,
    name: "Jaipur Weekend",
    startDate: "15 Dec 2024",
    endDate: "18 Dec 2024",
    budget: 30000,
    status: "completed",
  },
];

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-slate-200 text-slate-700",
};

const Trips = () => {
  return (
    <div>
      <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-6 py-10">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Your Trips
          </h1>

          <button className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition">
            + Add New Trip
          </button>
        </div>

        {/* TRIPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tripsData.map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border
                ${
                  trip.status === "active"
                    ? "border-emerald-400"
                    : "border-transparent"
                }`}
            >
              {/* STATUS */}
              <span
                className={`inline-block px-3 py-1 text-xs rounded-full font-medium mb-4 ${
                  statusStyles[trip.status]
                }`}
              >
                {trip.status.toUpperCase()}
              </span>

              {/* TRIP INFO */}
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                {trip.name}
              </h2>

              <p className="text-sm text-slate-500 mb-3">
                {trip.startDate} – {trip.endDate}
              </p>

              <p className="text-sm text-slate-600 mb-6">
                Budget:{" "}
                <span className="font-semibold text-slate-800">
                  ₹{trip.budget}
                </span>
              </p>

              {/* ACTION */}
              <Link to={`/trip/${trip.id}`}>
                <button className="w-full py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition">
                  View Trip Details
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
    </div>
  )
}

export default Trips
