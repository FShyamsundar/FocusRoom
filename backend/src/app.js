import cors from "cors";
import express from "express";
import morgan from "morgan";

import { corsOptions } from "./config/cors.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import focusRoutes from "./routes/focusRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "FocusRoom API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/community", communityRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
