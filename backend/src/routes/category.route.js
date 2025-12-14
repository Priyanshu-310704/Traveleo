import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Create category
 */
router.post("/categories", authMiddleware, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO categories (user_id, name)
       VALUES ($1, $2)
       RETURNING id, name, created_at`,
      [userId, name]
    );

    res.status(201).json({
      success: true,
      category: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get all categories for logged-in user
 */
router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM categories WHERE user_id = $1 ORDER BY name",
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      categories: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
