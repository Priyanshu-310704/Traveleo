import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import NewTripModal from "../components/NewTripModal";
import DeleteTripModal from "../components/DeleteTripModal";
import { getTrips } from "../api/dashboard.api";
import { createTrip, deleteTrip } from "../api/trip.api";
import { formatDate } from "../utils/formatDate";

/* STATUS STYLES */
const statusStyles = {
  active: "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30",
  upcoming: "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30",
  completed: "bg-slate-400/15 text-slate-300 border border-slate-400/30",
};

const statusPriority = { active: 0, upcoming: 1, completed: 2 };

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
  const [deleteTripTarget, setDeleteTripTarget] = useState(null);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const res = await getTrips();
      setTrips(res.data?.trips || []);
    } catch (err) {
      console.error("Trips load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleCreateTrip = async (tripData) => {
    await createTrip(tripData);
    setShowNewTripModal(false);
    loadTrips();
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteTrip(tripId);
      setDeleteTripTarget(null);
      loadTrips();
    } catch {
      alert("Failed to delete trip");
    }
  };

  const sortedTrips = [...trips].sort((a, b) => {
    const sa = getTripStatus(a.start_date, a.end_date);
    const sb = getTripStatus(b.start_date, b.end_date);
    return statusPriority[sa] - statusPriority[sb];
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0F172A] via-[#0B3C3A] to-[#064E3B] text-white">
      <Sidebar />

      <div className="flex flex-col flex-grow pl-64">
        <main className="flex-grow px-8 py-12 max-w-7xl mx-auto w-full">
          <div className="flex justify-between mb-12">
            <h1 className="text-3xl font-bold">
              Your{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Trips
              </span>
            </h1>

            <button
              onClick={() => setShowNewTripModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold shadow-lg"
            >
              + New Trip
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTrips.map((trip) => {
              const status = getTripStatus(trip.start_date, trip.end_date);

              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <button
                    onClick={() => setDeleteTripTarget(trip)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 />
                  </button>

                  <span className={`px-3 py-1 text-xs rounded-full ${statusStyles[status]}`}>
                    {status.toUpperCase()}
                  </span>

                  <h2 className="text-xl font-semibold mt-4">{trip.title}</h2>

                  <p className="text-sm text-white/60 mb-4">
                    {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
                  </p>

                  <Link to={`/trips/${trip.id}`}>
                    <button className="w-full py-3 rounded-xl bg-white/10 text-emerald-300">
                      View Trip Details
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </main>

        <Footer />
      </div>

      {showNewTripModal && (
        <NewTripModal
          onClose={() => setShowNewTripModal(false)}
          onCreate={handleCreateTrip}
        />
      )}

      {deleteTripTarget && (
        <DeleteTripModal
          trip={deleteTripTarget}
          onClose={() => setDeleteTripTarget(null)}
          onConfirm={handleDeleteTrip}
        />
      )}
    </div>
  );
};

export default Trips;
