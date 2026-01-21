import { Router } from "express";
import { router as usersRoutes } from "./users.routes.js";
import { router as productRoutes } from "./products.routes.js";
import ordersRoutes from "./orders.routes.js";

export const router = Router();

router.use("/users", usersRoutes);
router.use("/products", productRoutes);
router.use("/orders", ordersRoutes);
