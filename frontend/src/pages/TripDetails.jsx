import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
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

  /* LOAD DATA */
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

  /* CALCULATIONS */
  const filteredExpenses =
    filter === "All" ? expenses : expenses.filter((e) => e.category === filter);

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);

  const remaining = budget - totalSpent;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-400 bg-[#0F172A]">
        Loading trip details...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/60 bg-[#0F172A]">
        Trip not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0F172A] via-[#0B3C3A] to-[#064E3B] text-white">
      {/* SIDEBAR */}
      <Sidebar />

      {/* PAGE CONTENT */}
      <div className="flex flex-col flex-grow pl-64">
        {/* MAIN */}
        <main className="flex-grow px-8 py-12 max-w-7xl mx-auto w-full">
          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold">
              {trip.title}
              {trip.destination && (
                <span className="text-white/60 font-medium">
                  {" "}
                  • {trip.destination}
                </span>
              )}
            </h1>

            <p className="text-sm text-white/60 mt-2">
              {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
            </p>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard title="Trip Budget" value={`₹${budget}`} />
            <StatCard
              title="Total Spent"
              value={`₹${totalSpent}`}
              color="text-red-400"
            />
            <StatCard
              title="Remaining"
              value={`₹${remaining}`}
              color={remaining < 0 ? "text-red-500" : "text-emerald-400"}
            />
          </div>

          {/* EXPENSE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
            <h2 className="text-xl font-semibold">Expenses</h2>

            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="
    px-4 py-2 rounded-xl
    bg-white/10 backdrop-blur-xl
    border border-white/20
    text-white text-sm
    outline-none cursor-pointer
    focus:ring-2 focus:ring-emerald-400
  "
              >
                <option className="bg-[#0F172A] text-white">All</option>

                {[...new Set(expenses.map((e) => e.category))].map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-[#0F172A] text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="
                  px-5 py-2 rounded-xl
                  bg-gradient-to-r from-emerald-500 to-teal-500
                  font-semibold shadow-lg shadow-emerald-500/30
                  hover:brightness-110 transition
                "
              >
                + Add Expense
              </button>
            </div>
          </div>

          {/* EXPENSE TABLE */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-sm font-semibold">Amount</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((e) => (
                  <tr
                    key={e.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4">{e.title || "—"}</td>
                    <td className="px-6 py-4 text-white/70">{e.category}</td>
                    <td className="px-6 py-4 font-semibold">₹{e.amount}</td>
                  </tr>
                ))}

                {filteredExpenses.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-10 text-center text-white/50"
                    >
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>

        {/* FOOTER — NOW ALWAYS AT BOTTOM */}
        <Footer />
      </div>

      {/* ADD EXPENSE MODAL */}
      {showAddExpenseModal && (
        <AddExpenseModal
          tripId={id}
          onClose={() => setShowAddExpenseModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

/* SMALL UI */
const StatCard = ({ title, value, color = "text-white" }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
    <p className="text-sm text-white/50">{title}</p>
    <h2 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h2>
  </div>
);

export default TripDetails;
