import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const initialTrips = [
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
  const [trips, setTrips] = useState(initialTrips);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    budget: "",
  });

  const handleAddTrip = () => {
    if (!form.name || !form.startDate || !form.endDate || !form.budget) return;

    setTrips([
      ...trips,
      {
        id: Date.now(),
        ...form,
        budget: Number(form.budget),
        status: "upcoming",
      },
    ]);

    setForm({ name: "", startDate: "", endDate: "", budget: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Your Trips
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
          >
            + Add New Trip
          </button>
        </div>

        {/* TRIPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border ${
                trip.status === "active"
                  ? "border-emerald-400"
                  : "border-transparent"
              }`}
            >
              <span
                className={`inline-block px-3 py-1 text-xs rounded-full font-medium mb-4 ${
                  statusStyles[trip.status]
                }`}
              >
                {trip.status.toUpperCase()}
              </span>

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

              <Link to={`/trips/${trip.id}`}>
                <button className="w-full py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition">
                  View Trip Details
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ADD TRIP MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Add New Trip
              </h3>

              <input
                placeholder="Trip name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full mb-3 px-4 py-2 rounded-xl border"
              />

              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full mb-3 px-4 py-2 rounded-xl border"
              />

              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                className="w-full mb-3 px-4 py-2 rounded-xl border"
              />

              <input
                type="number"
                placeholder="Budget"
                value={form.budget}
                onChange={(e) =>
                  setForm({ ...form, budget: e.target.value })
                }
                className="w-full mb-4 px-4 py-2 rounded-xl border"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTrip}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold"
                >
                  Add Trip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Trips;
