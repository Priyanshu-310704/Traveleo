import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Create a trip
 */
router.post("/trips", authMiddleware, async (req, res) => {
  const { title, destination, start_date, end_date } = req.body;
  const userId = req.user.id; // from JWT

  try {
    const result = await pool.query(
      `INSERT INTO trips (user_id, title, destination, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, destination, start_date, end_date]
    );

    res.status(201).json({
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

/**
 * Get all trips of logged-in user
 */
router.get("/trips", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC",
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
