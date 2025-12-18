import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiTag, FiDollarSign, FiCalendar, FiFileText } from "react-icons/fi";
import { getCategories, createCategory } from "../api/category.api";
import { createExpense } from "../api/expense.api";

const AddExpenseModal = ({ tripId, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        const list = res.data.categories || res.data.data || res.data || [];
        setCategories(list);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!amount || !date) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      let finalCategoryId = categoryId;

      if (!finalCategoryId && newCategory.trim()) {
        const catRes = await createCategory({ name: newCategory });
        finalCategoryId = catRes.data.category.id;
      }

      if (!finalCategoryId) {
        alert("Please select or add a category");
        setLoading(false);
        return;
      }

      await createExpense({
        trip_id: tripId,
        category_id: finalCategoryId,
        amount: Number(amount),
        description,
        expense_date: date,
      });

      onSuccess();
      onClose();
    } catch {
      alert("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="
          w-full max-w-md rounded-3xl
          bg-white/5 backdrop-blur-2xl
          border border-white/15
          shadow-[0_40px_120px_rgba(0,0,0,0.55)]
          p-6 sm:p-8 text-white
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add Expense</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <FiX size={22} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* CATEGORY SELECT — FIXED */}
          <div className="relative">
            <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                text-white
                outline-none appearance-none
                focus:ring-2 focus:ring-emerald-400
              "
            >
              <option value="" className="bg-[#0F172A] text-white">
                Select category *
              </option>

              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="bg-[#0F172A] text-white"
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* NEW CATEGORY */}
          <input
            type="text"
            placeholder="Or add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/10 border border-white/20
              text-white placeholder-white/40
              outline-none focus:ring-2 focus:ring-emerald-400
            "
          />

          {/* AMOUNT */}
          <div className="relative">
            <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="number"
              placeholder="Amount *"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                text-white placeholder-white/40
                outline-none focus:ring-2 focus:ring-emerald-400
              "
            />
          </div>

          {/* DESCRIPTION */}
          <div className="relative">
            <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                text-white placeholder-white/40
                outline-none focus:ring-2 focus:ring-emerald-400
              "
            />
          </div>

          {/* DATE */}
          <div className="relative">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                text-white
                outline-none focus:ring-2 focus:ring-emerald-400
              "
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              px-6 py-2 rounded-xl
              bg-gradient-to-r from-emerald-500 to-teal-500
              font-semibold
              shadow-lg shadow-emerald-500/30
              hover:brightness-110
            "
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddExpenseModal;
