// Request validation middleware for the analyze route. Rejects empty or
// wrongly shaped input with a 400 before the controller touches the service
// or the database.

export function validateAnalyze(req, res, next) {
  const { text } = req.body || {};
  if (typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Provide a non-empty 'text' field." });
  }
  next();
}
