import { Router } from "express";
import { getProduct, getProducts } from "../../modules/product/product.controller.js";

export const router = Router()

router.get("/", getProducts);

router.get("/id", getProduct)