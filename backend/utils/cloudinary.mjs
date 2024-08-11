import "dotenv/config"
import fs from "fs"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = (file, folder) => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!file) reject(new Error("file not provided"));

            const response = await cloudinary.uploader.upload(file?.path, {
                resource_type: "auto",
                folder: folder
            })

            fs.unlink(localFilePath, (unlinkError) => {
                if (unlinkError) {
                    console.error("error removing local file:", unlinkError);
                }
            });

            return response;

        } catch (error) {
            fs.unlinkSync(localFilePath)
            reject(error)
        }

    })

}