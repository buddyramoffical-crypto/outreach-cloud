// api/sendEmail.js (CommonJS for Vercel Functions)
const sgMail = require("@sendgrid/mail");

// guard: missing envs
if (!process.env.SENDGRID_API_KEY || !process.env.MAIL_FROM) {
  console.warn("Missing SENDGRID_API_KEY or MAIL_FROM env");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // parse body safely
    let body = req.body;
    if (!body || typeof body === "string") {
      try { body = JSON.parse(body || "{}"); } catch (_) { body = {}; }
    }

    const { to, subject, text } = body;
    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing parameters: to, subject, text" });
    }

    await sgMail.send({
      to,
      from: { email: process.env.MAIL_FROM },
      subject,
      text
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("sendEmail error:", err?.response?.body || err?.message || err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
