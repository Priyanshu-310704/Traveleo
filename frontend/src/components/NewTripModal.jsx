import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiX,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";

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
      total_budget: Number(budget),
    });
  };

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50 flex items-center justify-center px-4
        bg-black/50 backdrop-blur-md
      "
    >
      {/* MODAL */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-lg
          rounded-3xl
          bg-white/5 backdrop-blur-2xl
          border border-white/15
          shadow-[0_40px_120px_rgba(0,0,0,0.6)]
          text-white
          p-8
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Create New Trip</h2>
            <p className="text-sm text-white/60 mt-1">
              Plan your journey and set a budget
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              text-white/60 hover:text-white
              hover:bg-white/10
              transition
            "
          >
            <FiX size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* TITLE */}
          <Input
            placeholder="Trip title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* DESTINATION */}
          <Input
            icon={<FiMapPin />}
            placeholder="Destination (optional)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              icon={<FiCalendar />}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              icon={<FiCalendar />}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* BUDGET */}
          <Input
            icon={<FiDollarSign />}
            type="number"
            placeholder="Total budget (₹) *"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl
              text-white/70
              hover:text-white
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
              bg-gradient-to-r from-emerald-500 to-teal-500
              font-semibold
              shadow-lg shadow-emerald-500/30
              hover:brightness-110
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

/* ================= INPUT ================= */
const Input = ({ icon, ...props }) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
        {icon}
      </span>
    )}
    <input
      {...props}
      className={`
        w-full py-3 rounded-xl
        ${icon ? "pl-11" : "pl-4"} pr-4
        bg-white/10 border border-white/20
        text-white placeholder-white/40
        outline-none
        focus:ring-2 focus:ring-emerald-400
      `}
    />
  </div>
);

export default NewTripModal;
