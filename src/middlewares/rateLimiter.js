import rateLimit from "express-rate-limit";

const jsonRateLimitHandler = (req, res, _next, options) => {
  res.status(options.statusCode).json({
    success: false,
    status: options.statusCode,
    message: options.message,
  });
};

const isProd = process.env.NODE_ENV === "production";

// General API limiter (high; avoids breaking dev refresh flows)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 2000 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonRateLimitHandler,
  message: "Too many requests. Please try again later.",
});

// Auth/login limiter (tighter in prod; relaxed in dev)
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: isProd ? 20 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonRateLimitHandler,
  message: "Too many login attempts. Please wait and try again.",
  // Optional: don't punish successful logins
  skipSuccessfulRequests: true,
});
