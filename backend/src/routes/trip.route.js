import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Create a trip + budget (single flow)
 */
router.post("/trips", authMiddleware, async (req, res) => {
  const {
    title,
    destination,
    start_date,
    end_date,
    total_budget
  } = req.body;

  const userId = req.user.id;

  // 🔐 Validation
  if (!title || !start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing"
    });
  }

  if (!total_budget || Number(total_budget) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Budget is required and must be > 0"
    });
  }

  try {
    // 🟢 START TRANSACTION
    await pool.query("BEGIN");

    // 1️⃣ Create trip
    const tripResult = await pool.query(
      `
      INSERT INTO trips (user_id, title, destination, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [userId, title, destination, start_date, end_date]
    );

    const trip = tripResult.rows[0];

    // 2️⃣ Create budget for trip
    await pool.query(
      `
      INSERT INTO budgets (user_id, trip_id, total_budget)
      VALUES ($1, $2, $3)
      `,
      [userId, trip.id, total_budget]
    );

    // 🟢 COMMIT
    await pool.query("COMMIT");

    res.status(201).json({
      success: true,
      trip
    });

  } catch (error) {
    // 🔴 ROLLBACK on error
    await pool.query("ROLLBACK");

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get all trips of logged-in user
 */
router.get("/trips", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM trips
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      trips: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
