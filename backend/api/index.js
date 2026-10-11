// Vercel serverless entry point. Vercel imports this file on cold start and
// invokes the exported Express app for every request; the rewrite in
// vercel.json sends all traffic here. Routes, controllers, services, models
// and the DB config are all imported through server.js.
import app from "../server.js";

export default app;
