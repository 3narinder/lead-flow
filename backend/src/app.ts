import express from "express";
import cors from "cors";

import leadRoutes from "./routes/leads.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

//* Global middleware

app.use(cors());
app.use(express.json());

//* Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "LeadFlow API is healthy",
  });
});

app.use("/api/leads", leadRoutes);

//* IMPORTANT: Error middleware must come AFTER all routes. Errors forwarded using next(error) will reach this middleware.
app.use(errorHandler);

export default app;
