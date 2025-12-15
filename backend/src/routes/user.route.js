import { Router } from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import { sendWelcomeMail } from "../services/mail.service.js";

const router = Router();

/* ======================================================
   SIGN UP – CREATE USER + DEFAULT CATEGORIES
====================================================== */
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2️⃣ Create user
    const userResult = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [name, email, hashedPassword]
    );

    const user = userResult.rows[0];

    // 3️⃣ Default categories
    const DEFAULT_CATEGORIES = [
      "Food",
      "Travel",
      "Stay",
      "Transport",
      "Shopping",
      "Entertainment",
      "Miscellaneous"
    ];

    // 4️⃣ Insert default categories for this user
    const values = DEFAULT_CATEGORIES
      .map((_, i) => `($1, $${i + 2})`)
      .join(",");

    await pool.query(
      `
      INSERT INTO categories (user_id, name)
      VALUES ${values}
      `,
      [user.id, ...DEFAULT_CATEGORIES]
    );

    // 5️⃣ Response
    res.status(201).json({
      success: true,
      user
    });

  } catch (error) {
    // Duplicate email
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* ======================================================
   LOGIN
====================================================== */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user
    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = userResult.rows[0];

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    sendWelcomeMail(user.email, user.name)
    .catch(err => console.log("Mail error:", err.message));

    // 4️⃣ Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* ======================================================
   GET ALL USERS (PROTECTED)
====================================================== */
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, created_at FROM users`
    );

    res.status(200).json({
      success: true,
      users: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
