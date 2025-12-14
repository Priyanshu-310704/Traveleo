import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Get budget insights for a trip
 */
router.get("/trips/:tripId/insights", authMiddleware, async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  try {
    // 1️⃣ Get total budget
    const budgetResult = await pool.query(
      `
      SELECT total_budget
      FROM budgets
      WHERE trip_id = $1 AND user_id = $2
      `,
      [tripId, userId]
    );

    if (budgetResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Budget not set for this trip"
      });
    }

    const totalBudget = Number(budgetResult.rows[0].total_budget);

    // 2️⃣ Category-wise spending
    const categoryResult = await pool.query(
      `
      SELECT c.name AS category, SUM(e.amount) AS total_spent
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.trip_id = $1 AND e.user_id = $2
      GROUP BY c.name
      ORDER BY total_spent DESC
      `,
      [tripId, userId]
    );

    // 3️⃣ Total spent
    const totalSpent = categoryResult.rows.reduce(
      (sum, row) => sum + Number(row.total_spent),
      0
    );

    // 4️⃣ Generate advice
    const insights = [];

    if (totalSpent > totalBudget) {
      insights.push(
        `You are over budget by ₹${(totalSpent - totalBudget).toFixed(2)}.`
      );
    } else {
      insights.push(
        `You have ₹${(totalBudget - totalSpent).toFixed(2)} remaining.`
      );
    }

    if (categoryResult.rows.length > 0) {
      const topCategory = categoryResult.rows[0];
      const percent = ((topCategory.total_spent / totalBudget) * 100).toFixed(1);

      insights.push(
        `Highest spending is on ${topCategory.category} (${percent}% of budget).`
      );
    }

    res.status(200).json({
      success: true,
      summary: {
        total_budget: totalBudget,
        total_spent: totalSpent,
        remaining: totalBudget - totalSpent
      },
      category_breakdown: categoryResult.rows,
      insights
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
