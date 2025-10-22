// api/echo.js
module.exports = async (req, res) => {
  // ננסה לקרוא גוף אם יש
  let body = req.body;
  if (!body || typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch (_) {}
  }

  res.status(200).json({
    ok: true,
    method: req.method,
    // חלק מהלקוחות שולחים OPTIONS לפני POST (CORS/preflight)
    contentType: req.headers["content-type"] || null,
    body
  });
};
