import { Router } from "express";
import { router as v1Routes } from "./v1/index.js";
import { router as v2Routes } from "./v2/index.js";
import { router as uploadRoutes } from "./upload.routes.js";

export const router = Router();

router.use("/v1", v1Routes);
router.use("/upload", uploadRoutes);
router.use("/v2", v2Routes);

// v1 → mock DB
// v2 → MongoDB จริง