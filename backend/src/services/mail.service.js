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
  background-color:#f1f5f9;
  font-family: Arial, Helvetica, sans-serif;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 10px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" style="
          max-width:600px;
          background:#ffffff;
          border-radius:18px;
          overflow:hidden;
          box-shadow:0 12px 30px rgba(0,0,0,0.08);
        ">

          <!-- HEADER -->
          <tr>
            <td style="
              background:linear-gradient(135deg,#10b981,#059669);
              padding:22px;
              text-align:left;
            ">
              <h1 style="
                margin:0;
                font-size:24px;
                color:#ffffff;
              ">
                ✈️ Traveleo
              </h1>
              <p style="
                margin:6px 0 0;
                font-size:14px;
                color:#d1fae5;
              ">
                Travel smarter. Spend wiser.
              </p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:26px 22px;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="
              background:#f8fafc;
              padding:16px;
              text-align:center;
              font-size:12px;
              color:#64748b;
            ">
              ${footer}<br/>
              © ${new Date().getFullYear()} Traveleo
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

/* ===================== WELCOME EMAIL (SIGNUP ONLY) ===================== */
export const sendWelcomeMail = async (email, name) => {
  const content = `
    <h2 style="margin:0 0 12px; color:#0f172a; font-size:20px;">
      Welcome to Traveleo, ${name} 👋
    </h2>

    <p style="color:#334155;font-size:15px;line-height:1.6;">
      We're thrilled to have you onboard! Traveleo helps you plan trips,
      manage expenses, and stay within budget — effortlessly.
    </p>

    <div style="
      background:#ecfdf5;
      border-left:4px solid #10b981;
      border-radius:12px;
      padding:16px;
      margin:18px 0;
    ">
      <p style="margin:0;color:#065f46;font-size:14px;line-height:1.6;">
        ✔ Create trips with budgets<br/>
        ✔ Track expenses by category<br/>
        ✔ Visualize spending clearly
      </p>
    </div>

    <p style="color:#334155;font-size:15px;">
      Start planning your next adventure and travel stress-free ✨
    </p>
  `;

  await transporter.sendMail({
    from: `"Traveleo ✈️" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Welcome to Traveleo ✈️",
    html: baseTemplate({
      title: "Welcome to Traveleo",
      content,
      footer: "You’re receiving this email because you signed up for Traveleo."
    })
  });
};

/* ===================== OTP EMAIL (LOGIN ONLY) ===================== */
export const sendOtpMail = async (email, name, otp) => {
  const content = `
    <h2 style="margin:0 0 12px; color:#0f172a; font-size:20px;">
      Login Verification 🔐
    </h2>

    <p style="color:#334155;font-size:15px;line-height:1.6;">
      Hello ${name}, use the OTP below to securely log in to your Traveleo account.
    </p>

    <div style="
      background:#f0fdfa;
      border:2px dashed #10b981;
      border-radius:14px;
      padding:18px;
      text-align:center;
      margin:22px 0;
    ">
      <p style="margin:0;font-size:14px;color:#065f46;">Your One-Time Password</p>
      <h1 style="
        margin:10px 0;
        font-size:34px;
        letter-spacing:6px;
        color:#065f46;
      ">
        ${otp}
      </h1>
      <p style="margin:0;font-size:13px;color:#065f46;">
        Valid for <strong>5 minutes</strong>
      </p>
    </div>

    <p style="color:#334155;font-size:14px;line-height:1.6;">
      If you did not request this login, please ignore this email.
      Your account remains secure.
    </p>
  `;

  await transporter.sendMail({
    from: `"Traveleo Security ✈️" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Traveleo Login OTP 🔐",
    html: baseTemplate({
      title: "Login OTP",
      content,
      footer: "This OTP is confidential. Do not share it with anyone."
    })
  });
};

/* ===================== TRIP REMINDER EMAIL ===================== */
export const sendTripReminderMail = async (email, name, trip) => {
  const content = `
    <h2 style="margin:0 0 12px; color:#0f172a; font-size:20px;">
      Upcoming Trip Reminder ⏰
    </h2>

    <p style="color:#334155;font-size:15px;">
      Hello ${name}, your upcoming trip is approaching:
    </p>

    <div style="
      background:#f0fdfa;
      border:1px solid #99f6e4;
      border-radius:14px;
      padding:16px;
      margin:18px 0;
    ">
      <p style="margin:0;font-size:15px;color:#065f46;">
        <strong>${trip.title}</strong>
      </p>
      <p style="margin-top:6px;font-size:14px;color:#334155;">
        📍 Destination: <strong>${trip.destination || "—"}</strong><br/>
        📅 Start Date: <strong>${trip.start_date}</strong>
      </p>
    </div>

    <p style="color:#334155;font-size:15px;">
      Start tracking your expenses early for a smooth journey 🌴
    </p>
  `;

  await transporter.sendMail({
    from: `"Traveleo ✈️" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Upcoming Trip Reminder ✈️",
    html: baseTemplate({
      title: "Trip Reminder",
      content,
      footer: "This is an automated reminder from Traveleo."
    })
  });
};
