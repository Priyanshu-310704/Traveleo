import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Add expense
 */
router.post("/expenses", authMiddleware, async (req, res) => {
  const { trip_id, category_id, amount, description, expense_date } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO expenses (user_id, trip_id, category_id, amount, description, expense_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, trip_id, category_id, amount, description, expense_date]
    );

    res.status(201).json({
      success: true,
      expense: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get all expenses for a trip
 */
router.get("/trips/:tripId/expenses", authMiddleware, async (req, res) => {
  const { tripId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT e.id, e.amount, e.description, e.expense_date,
             c.name AS category
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.trip_id = $1 AND e.user_id = $2
      ORDER BY e.expense_date DESC
      `,
      [tripId, req.user.id]
    );

    res.status(200).json({
      success: true,
      expenses: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
