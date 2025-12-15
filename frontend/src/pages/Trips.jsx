import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewTripModal from "../components/NewTripModal";
import { getTrips } from "../api/dashboard.api";
import { createTrip } from "../api/trip.api";
import { formatDate } from "../utils/formatDate";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-slate-200 text-slate-700",
};

const getTripStatus = (start, end) => {
  const today = new Date();
  if (today < new Date(start)) return "upcoming";
  if (today > new Date(end)) return "completed";
  return "active";
};

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTripModal, setShowNewTripModal] = useState(false);

  /* ================= LOAD TRIPS ================= */
  const loadTrips = async () => {
    try {
      setLoading(true);
      const res = await getTrips();
      setTrips(res.data?.trips || []);
    } catch (error) {
      console.error("Trips load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  /* ================= CREATE TRIP ================= */
  const handleCreateTrip = async (tripData) => {
    try {
      await createTrip(tripData);
      setShowNewTripModal(false);
      await loadTrips(); // 🔥 refresh list instantly
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create trip");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Your Trips</h1>

          <button
            onClick={() => setShowNewTripModal(true)}
            className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
          >
            + Add New Trip
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-slate-500">Loading trips...</p>
        )}

        {/* EMPTY STATE */}
        {!loading && trips.length === 0 && (
          <p className="text-center text-slate-500">
            No trips yet. Create your first trip ✈️
          </p>
        )}

        {/* TRIPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => {
            const status = getTripStatus(
              trip.start_date,
              trip.end_date
            );

            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border ${
                  status === "active"
                    ? "border-emerald-400"
                    : "border-transparent"
                }`}
              >
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full font-medium mb-4 ${statusStyles[status]}`}
                >
                  {status.toUpperCase()}
                </span>

                <h2 className="text-xl font-bold text-slate-800 mb-1">
                  {trip.title}
                </h2>

                <p className="text-sm text-slate-500 mb-3">
                  {formatDate(trip.start_date)} –{" "}
                  {formatDate(trip.end_date)}
                </p>

                <p className="text-sm text-slate-600 mb-6">
                  Destination:{" "}
                  <span className="font-semibold text-slate-800">
                    {trip.destination || "—"}
                  </span>
                </p>

                <Link to={`/trips/${trip.id}`}>
                  <button className="w-full py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition">
                    View Trip Details
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* NEW TRIP MODAL */}
      {showNewTripModal && (
        <NewTripModal
          onClose={() => setShowNewTripModal(false)}
          onCreate={handleCreateTrip}
        />
      )}

      <Footer />
    </div>
  );
};

export default Trips;
