import { cloudinary } from "../config/cloudinary.js";

export function uploadBufferToCloudinary({ buffer, folder }) {
  if (!buffer) {
    const error = new Error("No file buffer provided");
    error.status = 400;
    throw error;
  }

  if (!folder) {
    const error = new Error("No Cloudinary folder provided");
    error.status = 500;
    throw error;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result) return reject(new Error("Cloudinary upload failed"));

        resolve({
          url: result.secure_url || result.url,
          public_id: result.public_id,
        });
      },
    );

    stream.end(buffer);
  });
}
