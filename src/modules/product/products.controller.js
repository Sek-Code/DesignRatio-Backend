import mongoose from "mongoose";
import { ProductModel } from "./products.model.js";

const { isValidObjectId } = mongoose;

/**
 * ดึงข้อมูลสินค้าทั้งหมด
 */
export const getProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find();
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * ดึงข้อมูลสินค้าเพียงหนึ่งรายการ
 */
export const getProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    let product;
    if (isValidObjectId(id)) {
      product = await ProductModel.findById(id);
    }
    if (!product) {
      product = await ProductModel.findOne({ referencename: id });
    }
    if (!product) {
      const error = new Error("Product not found");
      return next(error);
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * สร้างสินค้าใหม่
 */
export const createProduct = async (req, res, next) => {
  const { name, type, image, price, stock_count, size, gram, is_active, referencename } = req.body;

  if (!name || !type || price === undefined || stock_count === undefined) {
    const error = new Error("name, type, price, stock_count are required");
    error.name = "ValidationError";
    return next(error);
  }

  try {
    const doc = await ProductModel.create({
      name,
      type,
      image,
      price,
      stock_count,
      size,
      gram,
      is_active,
      referencename,
    });

    return res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * อัปเดตข้อมูลสินค้า
 */
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  try {
    let updated;
    if (isValidObjectId(id)) {
      updated = await ProductModel.findByIdAndUpdate(id, body, { new: true });
    }
    if (!updated) {
      updated = await ProductModel.findOneAndUpdate(
        { referencename: id },
        body,
        { new: true }
      );
    }

    if (!updated) {
      const error = new Error("Product not found");
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * ลบสินค้า
 */
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    let deleted;
    if (isValidObjectId(id)) {
      deleted = await ProductModel.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await ProductModel.findOneAndDelete({ referencename: id });
    }

    if (!deleted) {
      const error = new Error("Product not found");
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    return next(error);
  }
};
