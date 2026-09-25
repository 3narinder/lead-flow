import express from "express";
import cors from "cors";

import leadRoutes from "./routes/leads.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "LeadFlow API is healthy",
  });
});

app.use("/api/leads", leadRoutes);

export default app;
