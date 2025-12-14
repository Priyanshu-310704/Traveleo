import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewTripModal from "../components/NewTripModal";
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
import AddExpenseModal from "../components/AddExpenseModal";

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
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const tripRes = await getTrips();
        const trips = tripRes.data?.trips || [];

        if (trips.length === 0) {
          setLoading(false);
          return;
        }

        const trip = trips[0];
        setActiveTrip(trip);

        /* Budget */
        try {
          const budgetRes = await getBudgetByTrip(trip.id);
          setBudget(Number(budgetRes.data?.total_budget || 0));
        } catch {
          setBudget(0);
        }

        /* Expenses */
        try {
          const expenseRes = await getExpensesByTrip(trip.id);
          const expenses = expenseRes.data?.expenses || [];

          const categoryMap = {};
          expenses.forEach((exp) => {
            const category = exp.category_name || "Other";
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

        /* Insights */
        try {
          const insightRes = await getTripInsights(trip.id);
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

    loadDashboard();
  }, []);

  /* ================= CREATE TRIP ================= */
  const handleCreateTrip = async (tripData) => {
    try {
      const res = await createTrip(tripData);
      const newTrip = res.data.trip;

      setActiveTrip(newTrip);
      setBudget(0);
      setExpenseData([]);
      setInsights([]);
      setShowNewTripModal(false);
    } catch (error) {
      console.error("Create trip error:", error);
      alert("Failed to create trip");
    }
  };

  /* ================= CALCULATIONS ================= */
  const totalSpent = expenseData.reduce((s, e) => s + e.value, 0);
  const remaining = Math.max(budget - totalSpent, 0);
  const usagePercent = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  /* ================= LOADING ================= */
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
            <span className="text-emerald-600">{user?.name || "Traveler"}</span>
          </h1>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowNewTripModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
            >
              + New Trip
            </button>

            {activeTrip && (
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 text-sm font-semibold"
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
            </h2>
            <p className="text-sm text-slate-600">
              {formatDate(activeTrip.start_date)} –{" "}
              {formatDate(activeTrip.end_date)}
            </p>
          </div>
        ) : (
          <div className="bg-white/70 p-6 rounded-2xl shadow-sm mb-10 text-center text-slate-600">
            No active trip yet. Create a trip to start tracking expenses.
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
            color="text-emerald-600"
          />
        </div>

        {/* BUDGET USAGE */}
        <div className="bg-white/70 p-6 rounded-2xl shadow-sm mb-10">
          <p className="font-semibold mb-3">Budget Usage</p>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                usagePercent > 80 ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          <p className="text-sm text-slate-500 mt-2">
            {usagePercent}% of budget used
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
              Add expenses to receive smart budget advice.
            </p>
          ) : (
            <ul className="space-y-2">
              {insights.map((tip, i) => (
                <li key={i} className="text-sm text-slate-700">
                  • {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* NEW TRIP MODAL */}
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
          onSuccess={() => window.location.reload()}
        />
      )}
      <Footer />
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */
const SummaryCard = ({ title, value, color = "" }) => (
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
  <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">
    No data yet
  </div>
);

export default Dashboard;
