import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

export const router = Router();

router.post("/avatar", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Missing file field "file"');
      error.status = 400;
      throw error;
    }

    const result = await uploadBufferToCloudinary({
      buffer: req.file.buffer,
      folder: "designratio/avatars",
    });

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

router.post("/product", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Missing file field "file"');
      error.status = 400;
      throw error;
    }

    const result = await uploadBufferToCloudinary({
      buffer: req.file.buffer,
      folder: "designratio/products",
    });

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});
