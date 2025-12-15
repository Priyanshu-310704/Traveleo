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

/**
 * Delete a trip (and related data)
 */
router.delete("/trips/:tripId", authMiddleware, async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  try {
    await pool.query("BEGIN");

    // 1️⃣ Delete expenses
    await pool.query(
      "DELETE FROM expenses WHERE trip_id = $1 AND user_id = $2",
      [tripId, userId]
    );

    // 2️⃣ Delete budget
    await pool.query(
      "DELETE FROM budgets WHERE trip_id = $1 AND user_id = $2",
      [tripId, userId]
    );

    // 3️⃣ Delete trip
    const result = await pool.query(
      "DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING *",
      [tripId, userId]
    );

    if (result.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    await pool.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Get single trip details (for TripDetails page)
 */
router.get("/trips/:tripId", authMiddleware, async (req, res) => {
  const { tripId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT t.*, b.total_budget
      FROM trips t
      LEFT JOIN budgets b ON t.id = b.trip_id
      WHERE t.id = $1 AND t.user_id = $2
      `,
      [tripId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    res.status(200).json({
      success: true,
      trip: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


export default router;
