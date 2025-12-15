import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiMapPin, FiCalendar, FiDollarSign } from "react-icons/fi";

const NewTripModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = () => {
    if (!title || !startDate || !endDate || !budget) {
      alert("Please fill all required fields");
      return;
    }

    if (Number(budget) <= 0) {
      alert("Budget must be greater than 0");
      return;
    }

    onCreate({
      title,
      destination,
      start_date: startDate,
      end_date: endDate,
      total_budget: Number(budget), // 🔥 IMPORTANT
    });
  };

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50 flex items-center justify-center px-4
        bg-gradient-to-br from-emerald-900/50 via-teal-900/50 to-green-900/50
        backdrop-blur-md
      "
    >
      {/* 🧊 GREEN GLASS MODAL */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-md
          rounded-3xl
          bg-emerald-100/20
          backdrop-blur-xl
          border border-emerald-200/30
          shadow-2xl
          p-6 sm:p-8
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create New Trip</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* TITLE */}
          <input
            type="text"
            placeholder="Trip title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/85 text-slate-800 placeholder-slate-500
              outline-none
              focus:ring-2 focus:ring-emerald-500
            "
          />

          {/* DESTINATION */}
          <div className="relative">
            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3 rounded-xl
                bg-white/85 text-slate-800 placeholder-slate-500
                outline-none
                focus:ring-2 focus:ring-emerald-500
              "
            />
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="
                  w-full pl-11 pr-4 py-3 rounded-xl
                  bg-white/85 text-slate-800
                  outline-none
                  focus:ring-2 focus:ring-emerald-500
                "
              />
            </div>

            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="
                  w-full pl-11 pr-4 py-3 rounded-xl
                  bg-white/85 text-slate-800
                  outline-none
                  focus:ring-2 focus:ring-emerald-500
                "
              />
            </div>
          </div>

          {/* BUDGET */}
          <div className="relative">
            <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
            <input
              type="number"
              placeholder="Trip Budget (₹) *"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3 rounded-xl
                bg-white/85 text-slate-800 placeholder-slate-500
                outline-none
                focus:ring-2 focus:ring-emerald-500
              "
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl
              text-white/80 hover:text-white
              hover:bg-white/10
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              px-6 py-2 rounded-xl
              bg-emerald-600 hover:bg-emerald-700
              text-white font-semibold
              transition
            "
          >
            Create Trip
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewTripModal;
