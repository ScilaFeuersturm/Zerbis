export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const msg = err?.message || "Server error";
  res.status(500).json({ error: msg });
}
