import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Create or update budget for a trip
 */
router.post("/trips/:tripId/budget", authMiddleware, async (req, res) => {
  const { tripId } = req.params;
  const { total_budget } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      INSERT INTO budgets (user_id, trip_id, total_budget)
      VALUES ($1, $2, $3)
      ON CONFLICT (trip_id)
      DO UPDATE SET total_budget = EXCLUDED.total_budget
      RETURNING *
      `,
      [userId, tripId, total_budget]
    );

    res.status(200).json({
      success: true,
      budget: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get budget + spent amount for a trip
 */
router.get("/trips/:tripId/budget", authMiddleware, async (req, res) => {
  const { tripId } = req.params;

  try {
    const budgetResult = await pool.query(
      `
      SELECT total_budget
      FROM budgets
      WHERE trip_id = $1 AND user_id = $2
      `,
      [tripId, req.user.id]
    );

    if (budgetResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Budget not set for this trip"
      });
    }

    const expenseResult = await pool.query(
      `
      SELECT COALESCE(SUM(amount), 0) AS total_spent
      FROM expenses
      WHERE trip_id = $1 AND user_id = $2
      `,
      [tripId, req.user.id]
    );

    const totalBudget = Number(budgetResult.rows[0].total_budget);
    const totalSpent = Number(expenseResult.rows[0].total_spent);
    const remaining = totalBudget - totalSpent;

    res.status(200).json({
      success: true,
      budget: {
        total_budget: totalBudget,
        total_spent: totalSpent,
        remaining,
        status: remaining < 0 ? "OVER BUDGET" : "WITHIN BUDGET"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
