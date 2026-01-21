import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import helmet from "helmet";

import { router as apiRoutes } from "./routes/index.js";
// import { limiter } from "./middlewares/rateLimiter.js";

export const app = express();

app.set("trust proxy", 1);

// Global middleware
// app.use(helmet());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://jsd-react-assessment-solution.vercel.app",
  ],
  credentials: true, // ✅  allow cookies to be sent
};

app.use(cors(corsOptions));

// app.use(limiter);

app.use(express.json());

// Middleware to parse cookies (required for cookie-based auth)
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRoutes);

// Catch-all for 404 Not Found
app.use((req, res, next) => {
  const error = new Error(`Not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.errorType = "NotFoundError";
  next(error);
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const errorType = err.errorType || err.name || "InternalServerError";

  res.status(statusCode).json({
    success: false,
    statusCode,
    errorType,
    message: err.message || "Something went wrong",
  });
});
