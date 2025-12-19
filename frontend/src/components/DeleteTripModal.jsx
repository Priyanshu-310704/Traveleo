import { motion } from "framer-motion";
import { FiTrash2, FiX } from "react-icons/fi";

const DeleteTripModal = ({ trip, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* MODAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="
          relative z-10 w-full max-w-md
          rounded-2xl bg-[#020617]
          border border-red-500/30
          p-6 shadow-2xl
        "
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <FiX size={18} />
        </button>

        {/* ICON */}
        <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
          <FiTrash2 className="text-red-400" size={26} />
        </div>

        <h2 className="text-xl font-semibold text-red-400 mb-2">
          Delete Trip
        </h2>

        <p className="text-sm text-white/70 mb-6 leading-relaxed">
          Are you sure you want to permanently delete
          <span className="font-semibold text-white">
            {" "}“{trip.title}”
          </span>
          ?
          <br />
          <span className="text-red-400">
            This action cannot be undone.
          </span>
        </p>

        {/* ACTIONS */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl
              bg-white/10 hover:bg-white/15
              text-sm font-medium transition
            "
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(trip.id)}
            className="
              px-5 py-2 rounded-xl
              bg-red-500 text-white
              font-semibold
              hover:bg-red-600 transition
            "
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteTripModal;
