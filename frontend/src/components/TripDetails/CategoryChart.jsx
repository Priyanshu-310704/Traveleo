import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* COLORS MATCHING YOUR THEME */
const COLORS = [
  "#34d399", // emerald
  "#22d3ee", // cyan
  "#60a5fa", // blue
  "#fbbf24", // amber
  "#f87171", // red
  "#c084fc", // purple
];

const CategoryChart = ({ expenses }) => {
  /* GROUP BY CATEGORY */
  const categoryMap = {};

  expenses.forEach((e) => {
    categoryMap[e.category] =
      (categoryMap[e.category] || 0) + Number(e.amount);
  });

  const data = Object.entries(categoryMap).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  if (data.length === 0) {
    return (
      <div className="text-white/50 text-center py-12">
        No expense data to visualize
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Category-wise Spending
      </h3>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => `₹${value}`}
              contentStyle={{
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
        {data.map((d, index) => (
          <div
            key={d.name}
            className="flex items-center gap-2 text-white/80"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  COLORS[index % COLORS.length],
              }}
            />
            {d.name} — ₹{d.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
