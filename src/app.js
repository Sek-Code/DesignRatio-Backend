import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { router as apiRoutes } from "./routes/index.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

export const app = express();

app.set("trust proxy", 1);

// Global middleware
app.use(helmet());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://design-ratio-web-app.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// General API limiter (login has its own limiter)
app.use(apiLimiter);

app.use(express.json());

app.use(cookieParser());

// API routes
app.use("/api", apiRoutes);

// ========== ERROR HANDLING ==========

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "This route does not exist",
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});
