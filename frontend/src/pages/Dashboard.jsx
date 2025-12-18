import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
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

/* 🌈 Neon-elegant palette */
const COLORS = [
  "#22ffc7", // neon mint
  "#00e5ff", // neon cyan
  "#4f9cff", // neon blue
  "#a855f7", // neon violet
  "#facc15", // neon amber
];

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

      /* BUDGET */
      try {
        const budgetRes = await getBudgetByTrip(active.id);
        setBudget(Number(budgetRes.data?.budget?.total_budget || 0));
      } catch {
        setBudget(0);
      }

      /* EXPENSES */
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

      /* INSIGHTS */
      try {
        const insightRes = await getTripInsights(active.id);
        setInsights(insightRes.data?.insights || []);
      } catch {
        setInsights([]);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* CREATE TRIP */
  const handleCreateTrip = async (tripData) => {
    try {
      await createTrip(tripData);
      setShowNewTripModal(false);
      await loadDashboard();
    } catch {
      alert("Failed to create trip");
    }
  };

  /* CALCULATIONS */
  const totalSpent = expenseData.reduce((s, e) => s + e.value, 0);
  const rawUsagePercent =
    budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;
  const visualUsagePercent = Math.min(rawUsagePercent, 100);
  const remaining = budget - totalSpent;
  const isOverBudget = rawUsagePercent > 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-400 bg-[#0F172A]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#0B3C3A] to-[#064E3B] text-white pl-64">
      <Sidebar />

      <main className="px-8 py-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10">
          <h1 className="text-3xl font-bold">
            Welcome,{" "}
            <span className="text-emerald-400">
              {user?.name || "Traveler"}
            </span>
          </h1>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowNewTripModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-semibold"
            >
              + New Trip
            </button>

            {activeTrip && (
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-4 py-2 rounded-lg border border-emerald-400 text-emerald-400 hover:bg-emerald-500/10 font-semibold"
              >
                + Add Expense
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE TRIP */}
        {activeTrip ? (
          <GlassCard className="mb-10">
            <p className="text-sm text-white/50">Active Trip</p>
            <h2 className="text-2xl font-bold text-emerald-400">
              {activeTrip.title}
              {activeTrip.destination && (
                <span className="text-white/60 font-medium">
                  {" "}• {activeTrip.destination}
                </span>
              )}
            </h2>
            <p className="text-sm text-white/60 mt-1">
              {formatDate(activeTrip.start_date)} –{" "}
              {formatDate(activeTrip.end_date)}
            </p>
          </GlassCard>
        ) : (
          <GlassCard className="mb-10 text-center">
            No active trip yet.
          </GlassCard>
        )}

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Budget" value={`₹${budget}`} />
          <StatCard title="Spent" value={`₹${totalSpent}`} color="text-red-400" />
          <StatCard
            title="Remaining"
            value={`₹${remaining}`}
            color={remaining < 0 ? "text-red-500" : "text-emerald-400"}
          />
        </div>

        {/* BUDGET BAR */}
        <GlassCard className="mb-10">
          <p className="font-semibold mb-2">Budget Usage</p>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                isOverBudget
                  ? "bg-red-500"
                  : rawUsagePercent > 80
                  ? "bg-yellow-400"
                  : "bg-emerald-400"
              }`}
              style={{ width: `${visualUsagePercent}%` }}
            />
          </div>
        </GlassCard>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* PIE */}
          <GlassCard title="Expense Distribution">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={expenseData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {expenseData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.9)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* BAR */}
          <GlassCard title="Category-wise Spending">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={expenseData}>
                <XAxis stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.9)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  fill="#22ffc7"
                />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* INSIGHTS */}
        <GlassCard>
          <h3 className="font-semibold mb-3">Smart Travel Advice</h3>
          {insights.length === 0 ? (
            <p className="text-sm text-white/60">
              Add expenses to receive insights.
            </p>
          ) : (
            <ul className="space-y-2">
              {insights.map((tip, i) => (
                <li key={i} className="text-sm">• {tip}</li>
              ))}
            </ul>
          )}
        </GlassCard>
      </main>

      <Footer />
    </div>
  );
};

/* UI HELPERS */
const GlassCard = ({ children, title, className = "" }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
    {title && <h3 className="font-semibold mb-4">{title}</h3>}
    {children}
  </div>
);

const StatCard = ({ title, value, color = "text-white" }) => (
  <GlassCard>
    <p className="text-sm text-white/50">{title}</p>
    <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
  </GlassCard>
);

export default Dashboard;
