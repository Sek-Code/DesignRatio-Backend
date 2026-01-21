import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../../modules/product/products.controller.js";

export const router = Router();

router.post("/", createProduct);

router.get("/", getProducts);

router.get("/:id", getProduct);

router.patch("/:id", updateProduct);

router.delete("/:id", deleteProduct);
