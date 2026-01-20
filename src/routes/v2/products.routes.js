import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,

} from "../../modules/product/products.controller.js";

export const router = Router()

router.get("/", getProducts);

router.get("/:id", getProduct)

router.post("/:id", createProduct)

router.delete("/:id", deleteProduct)

router.patch("/:id", updateProduct)