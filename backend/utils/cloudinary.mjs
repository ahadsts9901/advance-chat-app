import "dotenv/config"
import fs from "fs"
import { v2 as cloudinary } from "cloudinary"
import { cloudinaryChatFilesFolder } from "../core.mjs";

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

            fs.unlink(file?.path, (unlinkError) => {
                if (unlinkError) {
                    console.error("error removing local file:", unlinkError);
                }
            });

            resolve(response);

        } catch (error) {
            fs.unlinkSync(file?.path)
            reject(error)
        }

    })

}

export const deleteOnCloudinary = (fileUrl) => {

    return new Promise(async (resolve, reject) => {
        try {

            if (!fileUrl) {
                reject(new Error("file url not provided"))
                return null
            }

            const public_id = `${cloudinaryChatFilesFolder}/${fileUrl.split("/").pop().split(".")[0]}`

            const resp = await cloudinary.uploader.destroy(public_id)

            resolve(resp)

        } catch (error) {
            reject(error)
        }
    });

}