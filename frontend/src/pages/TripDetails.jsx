import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const tripData = {
  id: 1,
  name: "Goa Vacation",
  startDate: "10 Jan 2025",
  endDate: "18 Jan 2025",
  budget: 60000,
};

const initialExpenses = [
  { id: 1, title: "Hotel Stay", category: "Hotel", amount: 8000 },
  { id: 2, title: "Lunch", category: "Food", amount: 1200 },
  { id: 3, title: "Taxi", category: "Transport", amount: 900 },
  { id: 4, title: "Shopping", category: "Shopping", amount: 4000 },
];

const categories = ["All", "Food", "Transport", "Hotel", "Shopping"];

const TripDetails = () => {
  const { id } = useParams();

  const [expenses, setExpenses] = useState(initialExpenses);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Food",
    amount: "",
  });

  const filteredExpenses =
    filter === "All" ? expenses : expenses.filter((e) => e.category === filter);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = tripData.budget - totalSpent;

  const handleAddExpense = () => {
    if (!form.title || !form.amount) return;

    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        title: form.title,
        category: form.category,
        amount: Number(form.amount),
      },
    ]);

    setForm({ title: "", category: "Food", amount: "" });
    setShowModal(false);
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-slate-800 mb-1">
          {tripData.name}
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          {tripData.startDate} – {tripData.endDate}
        </p>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            ["Trip Budget", `₹${tripData.budget}`, "text-slate-800"],
            ["Total Spent", `₹${totalSpent}`, "text-red-500"],
            ["Remaining", `₹${remaining}`, "text-emerald-600"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm"
            >
              <p className="text-sm text-slate-500">{label}</p>
              <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
            </div>
          ))}
        </div>

        {/* EXPENSE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold text-slate-800">Expenses</h2>

          <div className="flex gap-3">
            {/* FILTER */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            {/* ADD BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* EXPENSE TABLE */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-slate-600">
                  Title
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-slate-600">
                  Category
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-slate-600">
                  Amount (₹)
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 text-slate-700">{expense.title}</td>
                  <td className="px-6 py-4 text-slate-700">
                    {expense.category}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    ₹{expense.amount}
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-6 text-center text-slate-500"
                  >
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
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
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Add Expense
              </h3>

              <input
                placeholder="Expense title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full mb-3 px-4 py-2 rounded-xl border"
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full mb-3 px-4 py-2 rounded-xl border"
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
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
                  onClick={handleAddExpense}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold"
                >
                  Add
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

export default TripDetails;
