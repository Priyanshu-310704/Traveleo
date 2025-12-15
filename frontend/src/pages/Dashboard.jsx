import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewTripModal from "../components/NewTripModal";
import AddExpenseModal from "../components/AddExpenseModal";
import { createTrip } from "../api/trip.api";
import { formatDate } from "../utils/formatDate";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import {
  getTrips,
  getExpensesByTrip,
  getBudgetByTrip,
} from "../api/dashboard.api";
import { getTripInsights } from "../api/insight.api";

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

const Dashboard = () => {
  const [activeTrip, setActiveTrip] = useState(null);
  const [expenseData, setExpenseData] = useState([]);
  const [budget, setBudget] = useState(0);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= LOAD DASHBOARD ================= */
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const tripRes = await getTrips();
      const trips = tripRes.data?.trips || [];

      const today = new Date();
      const active = trips.find(
        (t) =>
          today >= new Date(t.start_date) &&
          today <= new Date(t.end_date)
      );

      if (!active) {
        setActiveTrip(null);
        setBudget(0);
        setExpenseData([]);
        setInsights([]);
        return;
      }

      setActiveTrip(active);

      /* ===== BUDGET ===== */
      try {
        const budgetRes = await getBudgetByTrip(active.id);
        setBudget(Number(budgetRes.data?.budget?.total_budget || 0));
      } catch {
        setBudget(0);
      }

      /* ===== EXPENSES ===== */
      try {
        const expenseRes = await getExpensesByTrip(active.id);
        const expenses = expenseRes.data?.expenses || [];

        const categoryMap = {};
        expenses.forEach((exp) => {
          const category = exp.category || "Other";
          categoryMap[category] =
            (categoryMap[category] || 0) + Number(exp.amount);
        });

        setExpenseData(
          Object.entries(categoryMap).map(([name, value]) => ({
            name,
            value,
          }))
        );
      } catch {
        setExpenseData([]);
      }

      /* ===== INSIGHTS ===== */
      try {
        const insightRes = await getTripInsights(active.id);
        setInsights(insightRes.data?.insights || []);
      } catch {
        setInsights([]);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ================= CREATE TRIP ================= */
  const handleCreateTrip = async (tripData) => {
    try {
      const res = await createTrip(tripData);
      setActiveTrip(res.data.trip);
      setShowNewTripModal(false);
      await loadDashboard();
    } catch {
      alert("Failed to create trip");
    }
  };

  /* ================= CALCULATIONS ================= */
  const totalSpent = expenseData.reduce((s, e) => s + e.value, 0);

  const rawUsagePercent =
    budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  const visualUsagePercent = Math.min(rawUsagePercent, 100);
  const isOverBudget = rawUsagePercent > 100;
  const remaining = budget - totalSpent;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome,{" "}
            <span className="text-emerald-600">
              {user?.name || "Traveler"}
            </span>
          </h1>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowNewTripModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              + New Trip
            </button>

            {activeTrip && (
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 font-semibold"
              >
                + Add Expense
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE TRIP */}
        {activeTrip ? (
          <div className="bg-white/70 p-6 rounded-2xl shadow-sm mb-10">
            <p className="text-sm text-slate-500">Active Trip</p>

            <h2 className="text-2xl font-bold text-emerald-700">
              {activeTrip.title}
              {activeTrip.destination && (
                <span className="text-slate-500 font-medium">
                  {" "}
                  • {activeTrip.destination}
                </span>
              )}
            </h2>

            <p className="text-sm text-slate-600 mt-1">
              {formatDate(activeTrip.start_date)} –{" "}
              {formatDate(activeTrip.end_date)}
            </p>
          </div>
        ) : (
          <div className="bg-white/70 p-6 rounded-2xl shadow-sm text-center mb-10">
            No active trip yet.
          </div>
        )}

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SummaryCard title="Budget" value={`₹${budget}`} />
          <SummaryCard
            title="Spent"
            value={`₹${totalSpent}`}
            color="text-red-500"
          />
          <SummaryCard
            title="Remaining"
            value={`₹${remaining}`}
            color={remaining < 0 ? "text-red-600" : "text-emerald-600"}
          />
        </div>

        {/* BUDGET BAR */}
        <div className="bg-white/70 p-6 rounded-2xl shadow-sm mb-10">
          <p className="font-semibold mb-2">Budget Usage</p>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverBudget
                  ? "bg-red-500"
                  : rawUsagePercent > 80
                  ? "bg-orange-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${visualUsagePercent}%` }}
            />
          </div>

          <p className="text-sm mt-2 text-slate-600">
            {isOverBudget ? (
              <span className="text-red-600 font-semibold">
                Over budget by ₹{Math.abs(remaining)} ({rawUsagePercent}%)
              </span>
            ) : (
              `${rawUsagePercent}% of budget used`
            )}
          </p>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <ChartCard title="Expense Distribution">
            {expenseData.length === 0 ? (
              <Placeholder />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={expenseData} dataKey="value" nameKey="name">
                    {expenseData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Category-wise Spending">
            {expenseData.length === 0 ? (
              <Placeholder />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={expenseData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* INSIGHTS */}
        <div className="bg-white/70 p-6 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-3">Smart Travel Advice</h3>
          {insights.length === 0 ? (
            <p className="text-sm text-slate-500">
              Add expenses to receive advice.
            </p>
          ) : (
            <ul className="space-y-2">
              {insights.map((tip, i) => (
                <li key={i} className="text-sm">
                  • {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showNewTripModal && (
        <NewTripModal
          onClose={() => setShowNewTripModal(false)}
          onCreate={handleCreateTrip}
        />
      )}

      {showAddExpenseModal && activeTrip && (
        <AddExpenseModal
          tripId={activeTrip.id}
          onClose={() => setShowAddExpenseModal(false)}
          onSuccess={loadDashboard}
        />
      )}

      <Footer />
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */
const SummaryCard = ({ title, value, color = "text-slate-800" }) => (
  <div className="bg-white/70 p-6 rounded-2xl shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white/70 p-6 rounded-2xl shadow-sm">
    <h3 className="font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const Placeholder = () => (
  <div className="h-[260px] flex items-center justify-center text-slate-400">
    No data yet
  </div>
);

export default Dashboard;
