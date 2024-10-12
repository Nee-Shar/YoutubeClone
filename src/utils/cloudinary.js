import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadOnCloud = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //upload file on cloud
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file uploaded success delete from server
    // console.log("File uploaded successfully", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (e) {
    fs.unlinkSync(localFilePath); //delete file from server if
    // upload fails
  }
};
