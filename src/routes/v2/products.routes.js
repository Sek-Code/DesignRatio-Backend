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

router.get("/:nameref", getProduct)

router.post("/", createProduct)

router.delete("/:nameref",authUser, deleteProduct)

router.patch("/:nameref",authUser, updateProduct)