import cron from "node-cron";
import pool from "../config/db.js";
import { sendTripReminderMail } from "../services/mail.service.js";

// runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("🔔 Running trip reminder job");

  try {
    const result = await pool.query(`
      SELECT u.email, u.name, t.title, t.destination, t.start_date
      FROM trips t
      JOIN users u ON t.user_id = u.id
      WHERE t.start_date = CURRENT_DATE + INTERVAL '2 days'
    `);

    for (const row of result.rows) {
      await sendTripReminderMail(row.email, row.name, row);
    }
  } catch (error) {
    console.error("Cron job error:", error.message);
  }
});
