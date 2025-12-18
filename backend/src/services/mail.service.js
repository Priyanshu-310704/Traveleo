import transporter from "../config/mail.js";

/* ===================== BASE EMAIL LAYOUT ===================== */
const baseTemplate = ({ title, content, footer }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body style="
  margin:0;
  padding:0;
  background:#0f172a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" style="
          max-width:620px;
          background:#020617;
          border-radius:22px;
          overflow:hidden;
          box-shadow:0 20px 60px rgba(0,0,0,0.45);
        ">

          <!-- HEADER -->
          <tr>
            <td style="
              background:linear-gradient(135deg,#10b981,#14b8a6);
              padding:26px 28px;
            ">
              <h1 style="
                margin:0;
                font-size:24px;
                font-weight:700;
                color:#ecfdf5;
                letter-spacing:0.3px;
              ">
                ✈️ TraveLeo
              </h1>

              <p style="
                margin:6px 0 0;
                font-size:14px;
                color:#d1fae5;
                opacity:0.95;
              ">
                Travel smarter. Spend wiser.
              </p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="
              padding:32px 28px;
              background:#020617;
              color:#e5e7eb;
            ">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="
              background:#020617;
              border-top:1px solid rgba(255,255,255,0.08);
              padding:18px;
              text-align:center;
              font-size:12px;
              color:#94a3b8;
            ">
              ${footer}<br/>
              © ${new Date().getFullYear()} TraveLeo
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

/* ===================== WELCOME EMAIL ===================== */
export const sendWelcomeMail = async (email, name) => {
  const content = `
    <h2 style="
      margin:0 0 14px;
      font-size:22px;
      font-weight:700;
      color:#ecfdf5;
    ">
      Welcome aboard, ${name} 👋
    </h2>

    <p style="
      font-size:15px;
      line-height:1.7;
      color:#cbd5f5;
    ">
      You’re officially part of <strong>TraveLeo</strong> — your smart travel
      budgeting companion built for clarity, control, and peace of mind.
    </p>

    <div style="
      margin:22px 0;
      padding:18px;
      border-radius:16px;
      background:rgba(16,185,129,0.08);
      border:1px solid rgba(16,185,129,0.25);
    ">
      <p style="margin:0;font-size:14px;line-height:1.8;color:#d1fae5;">
        ✔ Create trips with budgets<br/>
        ✔ Track expenses in real time<br/>
        ✔ Visualize spending beautifully
      </p>
    </div>

    <p style="font-size:15px;color:#cbd5f5;">
      Start planning your next journey — and let TraveLeo handle the numbers ✨
    </p>
  `;

  await transporter.sendMail({
    from: `"TraveLeo ✈️" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Welcome to TraveLeo ✈️",
    html: baseTemplate({
      title: "Welcome to TraveLeo",
      content,
      footer: "You’re receiving this email because you created a TraveLeo account."
    })
  });
};

/* ===================== OTP EMAIL ===================== */
export const sendOtpMail = async (email, name, otp) => {
  const content = `
    <h2 style="
      margin:0 0 14px;
      font-size:22px;
      font-weight:700;
      color:#ecfdf5;
    ">
      Secure Login Verification 🔐
    </h2>

    <p style="font-size:15px;color:#cbd5f5;">
      Hi ${name}, use the one-time password below to securely access your account.
    </p>

    <div style="
      margin:26px 0;
      padding:22px;
      border-radius:18px;
      text-align:center;
      background:rgba(16,185,129,0.1);
      border:1px dashed rgba(16,185,129,0.4);
    ">
      <p style="margin:0;font-size:13px;color:#a7f3d0;">
        Your One-Time Password
      </p>

      <div style="
        margin:14px 0;
        font-size:36px;
        font-weight:800;
        letter-spacing:6px;
        color:#34d399;
      ">
        ${otp}
      </div>

      <p style="margin:0;font-size:12px;color:#a7f3d0;">
        Valid for <strong>5 minutes</strong>
      </p>
    </div>

    <p style="font-size:14px;color:#94a3b8;line-height:1.6;">
      If you didn’t request this login, you can safely ignore this email.
      Your account remains secure.
    </p>
  `;

  await transporter.sendMail({
    from: `"TraveLeo Security ✈️" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your TraveLeo Login OTP 🔐",
    html: baseTemplate({
      title: "Login OTP",
      content,
      footer: "This OTP is private. Never share it with anyone."
    })
  });
};

/* ===================== TRIP REMINDER EMAIL ===================== */
export const sendTripReminderMail = async (email, name, trip) => {
  const content = `
    <h2 style="
      margin:0 0 14px;
      font-size:22px;
      font-weight:700;
      color:#ecfdf5;
    ">
      Upcoming Trip Reminder ⏰
    </h2>

    <p style="font-size:15px;color:#cbd5f5;">
      Hello ${name}, your next journey is just around the corner.
    </p>

    <div style="
      margin:22px 0;
      padding:18px;
      border-radius:16px;
      background:rgba(20,184,166,0.08);
      border:1px solid rgba(20,184,166,0.25);
    ">
      <p style="margin:0;font-size:16px;font-weight:600;color:#ecfdf5;">
        ${trip.title}
      </p>

      <p style="margin-top:8px;font-size:14px;color:#cbd5f5;">
        📍 Destination: <strong>${trip.destination || "—"}</strong><br/>
        📅 Start Date: <strong>${trip.start_date}</strong>
      </p>
    </div>

    <p style="font-size:15px;color:#cbd5f5;">
      Start tracking your expenses early for a smooth and stress-free trip 🌍
    </p>
  `;

  await transporter.sendMail({
    from: `"TraveLeo ✈️" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Upcoming Trip Reminder ✈️",
    html: baseTemplate({
      title: "Trip Reminder",
      content,
      footer: "This is an automated reminder from TraveLeo."
    })
  });
};
