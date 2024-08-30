import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { userModel } from "../models/userModel.mjs"
import { _1mbSize, profilePictureUploadFolder, userNamePattern } from "../core.mjs"
import { uploadOnCloudinary } from "../utils/cloudinary.mjs"

export const getCurrentUserProfileController = async (req, res, next) => {

    try {

        const { currentUser } = req

        if (!currentUser) {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        const { _id } = currentUser

        if (!_id || _id?.trim() === "") {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        if (!isValidObjectId(_id)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        const user = await userModel.findById(_id).exec()

        if (!user) {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        if (!user?.isActive) {
            user.isActive = true
            await user.save()
        }

        const { userName, profilePhoto, email, createdOn, isEmailVerified, isAdmin, isActive } = user

        res.send({
            message: "profile fetched",
            data: { _id: user?._id, userName, profilePhoto, email, createdOn, isEmailVerified, isAdmin, isActive }
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const getUserProfileController = async (req, res, next) => {

    const { userId } = req?.params

    if (!userId || userId?.trim() === "") {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!isValidObjectId(userId)) {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    try {

        const user = await userModel.findById(userId).exec()

        if (!user) {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        const { _id, userName, profilePhoto, email, createdOn, isEmailVerified, isAdmin, isActive } = user

        res.send({
            message: "user profile fetched",
            data: { _id, userName, profilePhoto, email, createdOn, isEmailVerified, isAdmin, isActive }
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const updateUserNameController = async (req, res, next) => {

    const { _id } = req?.currentUser
    const { userName } = req?.body


    if (!_id || _id?.trim() === "") {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!isValidObjectId(_id)) {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!userName || userName?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.userNameRequired
        })
    }

    if (!userNamePattern?.test(userName?.trim())) {
        return res.status(400).send({
            message: errorMessages?.userNameInvalid
        })
    }

    try {

        const user = await userModel.findById(_id).exec()

        if (!user) {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        user.userName = userName?.trim()

        await user?.save()

        res.send({
            message: "username updated successfully"
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const updateProfilePictureController = async (req, res, next) => {

    const { files } = req
    const { _id } = req?.currentUser

    if (!_id || _id?.trim() === "") {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!isValidObjectId(_id)) {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!files || !files?.length || !files[0]) {
        return res.status(400).send({
            message: errorMessages?.noFileProvided
        })
    }

    const file = files[0]

    if (!file?.mimetype?.startsWith("image")) {
        return res.status(400).send({
            message: errorMessages?.onlyImagesAllowed
        })
    }

    if (file?.size > (_1mbSize * 2)) {
        return res.status(400).send({
            message: errorMessages?.largeImage
        })
    }

    try {

        const user = await userModel.findById(_id).exec()

        if (!user) {
            return res.status(401).send({
                message: errorMessages.unAuthError
            })
        }

        const imageUploadResp = await uploadOnCloudinary(file, profilePictureUploadFolder)

        user.profilePhoto = imageUploadResp?.url
        await user?.save()

        res.send({
            message: "profile picture updated successfully"
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const logoutController = async (req, res, next) => {

    try {

        const userId = req?.currentUser?._id

        if (!userId || userId?.trim() === "" || !isValidObjectId(userId)) {
            return res.status(500).send({
                message: errorMessages?.unAuthError
            })
        }

        const user = await userModel.findById(userId).exec()

        if (!user) {
            return res.status(500).send({
                message: errorMessages?.unAuthError
            })
        }

        user.isActive = false
        await user.save()

        res.clearCookie("hart")

        res.send({
            message: "logout successfull"
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const userOfflineController = async (req, res, next) => {

    try {

        const userId = req?.currentUser?._id

        if (!userId || userId?.trim() === "" || !isValidObjectId(userId)) {
            return res.status(500).send({
                message: errorMessages?.unAuthError
            })
        }

        const user = await userModel.findById(userId).exec()

        if (!user) {
            return res.status(500).send({
                message: errorMessages?.unAuthError
            })
        }

        user.isActive = false
        await user.save()

        res.send({
            message: errorMessages?.userOffline
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}