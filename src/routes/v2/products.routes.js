import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,

} from "../../modules/product/products.controller.js";
import { authUser } from "../../middlewares/auth.js";

export const router = Router()

router.get("/", getProducts);

router.get("/:id", getProduct)

router.post("/", createProduct)

router.delete("/:id",authUser, deleteProduct)

router.patch("/:id",authUser, updateProduct)