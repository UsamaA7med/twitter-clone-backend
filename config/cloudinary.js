import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpdateImage = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file, {
    resource_type: "auto",
  });
  fs.unlinkSync(file);
  return result;
};

const cloudinaryDeleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export { cloudinaryUpdateImage, cloudinaryDeleteImage };
