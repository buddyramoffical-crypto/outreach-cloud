const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

module.exports = async (req, res) => {
  setCors(res);

  // לטפל ב-OPTIONS (preflight) כדי שלא יחזור 405
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed", got: req.method });
  }

  try {
    // לקרוא גוף בבטחה
    let body = req.body;
    if (!body || typeof body === "string") {
      try { body = JSON.parse(body || "{}"); } catch (_) { body = {}; }
    }

    const { to, subject, text } = body || {};
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
    const msg = err?.response?.body || err?.message || String(err);
    console.error("sendEmail error:", msg);
    return res.status(500).json({ error: "Internal server error" });
  }
};
