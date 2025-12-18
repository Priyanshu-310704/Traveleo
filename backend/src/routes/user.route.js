import { Router } from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import { sendWelcomeMail, sendOtpMail } from "../services/mail.service.js";

const router = Router();

/* ======================================================
   SIGN UP – CREATE USER + DEFAULT CATEGORIES
====================================================== */
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [name, email, hashedPassword]
    );

    const user = userResult.rows[0];

    const DEFAULT_CATEGORIES = [
      "Food",
      "Travel",
      "Stay",
      "Transport",
      "Shopping",
      "Entertainment",
      "Miscellaneous",
    ];

    const values = DEFAULT_CATEGORIES.map((_, i) => `($1, $${i + 2})`).join(
      ","
    );

    await pool.query(
      `
      INSERT INTO categories (user_id, name)
      VALUES ${values}
      `,
      [user.id, ...DEFAULT_CATEGORIES]
    );

    // 🎉 Welcome Mail
    sendWelcomeMail(user.email, user.name).catch((err) =>
      console.log("Mail error:", err.message)
    );

    res.status(201).json({
      success: true,
      message: "Signup successful. Please login.",
      user,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ======================================================
   LOGIN – PASSWORD + SEND OTP
====================================================== */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔥 DELETE OLD OTPs
    await pool.query(`DELETE FROM user_otps WHERE user_id = $1`, [user.id]);

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await pool.query(
      `
      INSERT INTO user_otps (user_id, otp, expires_at)
      VALUES ($1, $2, $3)
      `,
      [user.id, otp, expiresAt]
    );

    // 📩 Send OTP mail
    await sendOtpMail(user.email, user.name, otp);

    res.status(200).json({
      success: true,
      otpRequired: true, // 🔥 ADD THIS
      userId: user.id,
      message: "OTP sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ======================================================
   VERIFY OTP – ISSUE JWT
====================================================== */
router.post("/verify-otp", async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const otpResult = await pool.query(
      `
      SELECT * FROM user_otps
      WHERE user_id = $1 AND otp = $2
      `,
      [userId, otp]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const otpRow = otpResult.rows[0];

    if (new Date() > otpRow.expires_at) {
      await pool.query(`DELETE FROM user_otps WHERE user_id = $1`, [userId]);

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // 🧹 Delete OTP after success
    await pool.query(`DELETE FROM user_otps WHERE user_id = $1`, [userId]);

    const userResult = await pool.query(
      `SELECT id, name, email FROM users WHERE id = $1`,
      [userId]
    );

    const user = userResult.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ======================================================
   RESEND OTP
====================================================== */
router.post("/resend-otp", async (req, res) => {
  const { userId } = req.body;

  try {
    const userResult = await pool.query(
      `SELECT id, name, email FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    await pool.query(`DELETE FROM user_otps WHERE user_id = $1`, [userId]);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `
      INSERT INTO user_otps (user_id, otp, expires_at)
      VALUES ($1, $2, $3)
      `,
      [userId, otp, expiresAt]
    );

    await sendOtpMail(user.email, user.name, otp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
