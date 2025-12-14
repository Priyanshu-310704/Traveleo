import React from "react";
import Navbar from "../components/Navbar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import Footer from "../components/Footer";

/* ACTIVE TRIP DATA (Later this will come from backend) */
const activeTrip = {
  name: "Goa Vacation",
  startDate: "10 Jan 2025",
  endDate: "18 Jan 2025",
  budget: 60000,
};

/* EXPENSE DATA FOR ACTIVE TRIP */
const expenseData = [
  { name: "Food", value: 18000 },
  { name: "Transport", value: 12000 },
  { name: "Hotel", value: 8000 },
  { name: "Shopping", value: 4000 },
];

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

const Dashboard = () => {
  const totalSpent = expenseData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const remaining = activeTrip.budget - totalSpent;
  const usagePercent = Math.round(
    (totalSpent / activeTrip.budget) * 100
  );
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Dashboard
        </h1>

        {/* ACTIVE TRIP CARD */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm mb-10">
          <p className="text-sm text-slate-500">Active Trip</p>
          <h2 className="text-2xl font-bold text-emerald-700 mt-1">
            {activeTrip.name}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {activeTrip.startDate} – {activeTrip.endDate}
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-slate-500">Trip Budget</p>
            <h2 className="text-2xl font-bold text-slate-800">
              ₹{activeTrip.budget}
            </h2>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-slate-500">Spent</p>
            <h2 className="text-2xl font-bold text-red-500">
              ₹{totalSpent}
            </h2>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-slate-500">Remaining</p>
            <h2 className="text-2xl font-bold text-emerald-600">
              ₹{remaining}
            </h2>
          </div>
        </div>

        {/* BUDGET USAGE */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm mb-10">
          <p className="font-semibold text-slate-700 mb-3">
            Budget Usage (Active Trip)
          </p>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                usagePercent > 80
                  ? "bg-red-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          <p className="text-sm text-slate-500 mt-2">
            {usagePercent}% of budget used
          </p>

          {usagePercent > 80 && (
            <p className="mt-3 text-sm font-semibold text-red-600">
              ⚠ You are close to exceeding your budget for this trip
            </p>
          )}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* PIE CHART */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-4">
              Expense Distribution (Active Trip)
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={expenseData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {expenseData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-4">
              Category-wise Spending
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={expenseData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
