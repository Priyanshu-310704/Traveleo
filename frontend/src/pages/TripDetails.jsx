import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddExpenseModal from "../components/AddExpenseModal";

import { getTripById } from "../api/trip.api";
import { getExpensesByTrip, getBudgetByTrip } from "../api/dashboard.api";
import { formatDate } from "../utils/formatDate";

const TripDetails = () => {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);

      const [tripRes, expenseRes, budgetRes] = await Promise.all([
        getTripById(id),
        getExpensesByTrip(id),
        getBudgetByTrip(id),
      ]);

      setTrip(tripRes.data.trip);
      setExpenses(expenseRes.data?.expenses || []);
      setBudget(Number(budgetRes.data?.budget?.total_budget || 0));
    } catch (err) {
      console.error("Trip details error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  /* ================= CALCULATIONS ================= */
  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((e) => e.category === filter);

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const remaining = Math.max(budget - totalSpent, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-600">
        Loading trip details...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Trip not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-700">
            {trip.title}
            {trip.destination && (
              <span className="text-slate-500 font-medium">
                {" "}
                • {trip.destination}
              </span>
            )}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SummaryCard title="Trip Budget" value={`₹${budget}`} />
          <SummaryCard
            title="Total Spent"
            value={`₹${totalSpent}`}
            color="text-red-500"
          />
          <SummaryCard
            title="Remaining"
            value={`₹${remaining}`}
            color="text-emerald-600"
          />
        </div>

        {/* EXPENSE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold text-slate-800">Expenses</h2>

          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-sm"
            >
              <option>All</option>
              {[...new Set(expenses.map((e) => e.category))].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* EXPENSE TABLE */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-sm font-semibold">Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-6 py-4">{e.title}</td>
                  <td className="px-6 py-4">{e.category}</td>
                  <td className="px-6 py-4">₹{e.amount}</td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No expenses yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {showAddExpenseModal && (
        <AddExpenseModal
          tripId={id}
          onClose={() => setShowAddExpenseModal(false)}
          onSuccess={loadData}
        />
      )}

      <Footer />
    </div>
  );
};

/* ================= SMALL COMPONENT ================= */
const SummaryCard = ({ title, value, color = "text-slate-800" }) => (
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
  </div>
);

export default TripDetails;
