import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { getCategories } from "../api/category.api";
import { createExpense } from "../api/expense.api";
import { createCategory } from "../api/category.api";

const AddExpenseModal = ({ tripId, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  /* LOAD CATEGORIES */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        const list = res.data.categories || res.data.data || res.data || [];
        setCategories(list);
      } catch (error) {
        console.error("Category load error:", error);
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

      /* 🆕 Create category if user typed new one */
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
    } catch (error) {
      console.error(error);
      alert("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-900/50 backdrop-blur-md px-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl bg-emerald-100/20 backdrop-blur-xl border border-emerald-200/30 shadow-2xl p-6"
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Add Expense</h2>
          <button onClick={onClose} className="text-white/70">
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/90"
          >
            <option value="">Select category *</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/85 outline-none"
          />

          <input
            type="number"
            placeholder="Amount *"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/90"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/90"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/90"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-white/80"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddExpenseModal;
