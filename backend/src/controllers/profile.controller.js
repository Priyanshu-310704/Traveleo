import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { sendAccountDeletedMail } from "../services/mail.service.js";

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const result = await pool.query(
      `
      UPDATE users 
      SET name = $1 
      WHERE id = $2 
      RETURNING id, name, email, created_at
      `,
      [name.trim(), userId]
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both passwords are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const userRes = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    const isValid = await bcrypt.compare(
      currentPassword,
      userRes.rows[0].password
    );
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const isSame = await bcrypt.compare(
      currentPassword,
      hashedPassword
    );
    if (isSame) {
      return res.status(401).json({
        success: false,
        message: "Current password must not be same",
      });
    }

    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

/* ================= DELETE ACCOUNT + CONFIRMATION MAIL ================= */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user before delete
    const userRes = await pool.query(
      "SELECT name, email FROM users WHERE id = $1",
      [userId]
    );

    const { name, email } = userRes.rows[0];

    // Delete user (CASCADE handles everything)
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    // Send confirmation mail (non-blocking)
    try {
      await sendAccountDeletedMail(email, name);
    } catch (mailErr) {
      console.error("Delete mail failed:", mailErr);
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};
