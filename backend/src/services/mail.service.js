import transporter from "../config/mail.js";

export const sendWelcomeMail = async (email, name) => {
  await transporter.sendMail({
    from: `"Traveleo ✈️" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Welcome to Traveleo!",
    html: `
      <h2>Welcome to Traveleo, ${name} 👋</h2>
      <p>Plan your trips, track expenses, and stay within budget.</p>
      <p>Happy travelling ✈️</p>
    `
  });
};

export const sendTripReminderMail = async (email, name, trip) => {
  await transporter.sendMail({
    from: `"Traveleo ✈️" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Upcoming Trip Reminder ⏰",
    html: `
      <h3>Hello ${name},</h3>
      <p>You have an upcoming trip:</p>
      <ul>
        <li><b>Trip:</b> ${trip.title}</li>
        <li><b>Destination:</b> ${trip.destination}</li>
        <li><b>Start Date:</b> ${trip.start_date}</li>
      </ul>
      <p>Start planning your expenses now 🚀</p>
    `
  });
};
