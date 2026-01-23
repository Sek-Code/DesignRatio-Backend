import mongoose from "mongoose";
import { ProductModel } from "./products.model.js";

const { isValidObjectId } = mongoose;

function normalizeImageFields(body) {
  if (!body || typeof body !== "object") return;

  if (body.imageUrl !== undefined && body.image === undefined) {
    body.image = body.imageUrl;
  }

  if (body.image !== undefined && body.imageUrl === undefined) {
    body.imageUrl = body.image;
  }

  if (body.images !== undefined && !Array.isArray(body.images)) {
    const error = new Error("images must be an array of urls");
    error.status = 400;
    throw error;
  }
}

/**
 * ดึงข้อมูลสินค้าทั้งหมด
 * - รองรับ query: ?type=ingredient (หรือหลายค่าแบบ comma-separated: ?type=ingredient,ready)
 */
export const getProducts = async (req, res, next) => {
  try {
    const { type } = req.query;

    const filter = {};
    if (type) {
      const types = String(type)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      filter.type = types.length > 1 ? { $in: types } : types[0];
    }

    const products = await ProductModel.find(filter);
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
  const {
    name,
    type,
    image,
    imageUrl,
    images,
    price,
    stock_count,
    size,
    gram,
    is_active,
    referencename,
  } = req.body;

  if (!name || !type || price === undefined || stock_count === undefined || !referencename) {
    const error = new Error("name, type, price, stock_count, referencename are required");
    error.status = 400;
    error.name = "ValidationError";
    return next(error);
  }

  try {
    const primaryImageUrl = imageUrl ?? image ?? "";

    const imagesArray = Array.isArray(images) ? images : [];
    const normalizedImages =
      imagesArray.length > 0
        ? imagesArray
        : primaryImageUrl
          ? [primaryImageUrl]
          : [];

    const doc = await ProductModel.create({
      name,
      type,
      // Back-compat: keep old `image` field in sync
      image: image ?? primaryImageUrl,
      imageUrl: primaryImageUrl,
      images: normalizedImages,
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
    normalizeImageFields(body);

    let updated;
    if (isValidObjectId(id)) {
      updated = await ProductModel.findByIdAndUpdate(id, body, { new: true });
    }
    if (!updated) {
      updated = await ProductModel.findOneAndUpdate({ referencename: id }, body, {
        new: true,
      });
    }

    if (!updated) {
      const error = new Error("Product not found");
      return next(error);
    }


    const shouldSyncImages =
      body.image !== undefined ||
      body.imageUrl !== undefined ||
      body.images !== undefined;

    if (shouldSyncImages && updated?.name) {
      await ProductModel.updateMany(
        { name: updated.name, _id: { $ne: updated._id } },
        { $set: {
            image: updated.image,
            imageUrl: updated.imageUrl,
            images: updated.images,
          },
        },
      );
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
