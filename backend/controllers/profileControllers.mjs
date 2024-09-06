import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { userModel } from "../models/userModel.mjs"
import { chatModel } from "../models/chatModel.mjs"
import { _1mbSize, profilePictureUploadFolder, userActiveChannel, userNamePattern, globalIoObject } from "../core.mjs"
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

        if (globalIoObject?.io) {

            console.log(`emitting online to ${user?._id}`)
            globalIoObject?.io?.emit(`${userActiveChannel}-${user?._id}`, { isActive: true })

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

export const getProfileMediaController = async (req, res, next) => {

    const { userId } = req?.params
    const currentUserId = req?.currentUser?._id

    if (!currentUserId || currentUserId?.trim() === "") {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!userId || userId?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.idIsMissing
        })
    }

    if (!isValidObjectId(userId)) {
        return res.status(400).send({
            message: errorMessages?.invalidId
        })
    }

    try {

        const user = await userModel.findById(userId).exec()

        if (!user) {
            return res.status(404).send({
                message: errorMessages?.noAccountFound
            })
        }

        const query = {
            $or: [
                { from_id: currentUserId, to_id: userId },
                { from_id: userId, to_id: currentUserId },
            ],
            messageType: { $ne: "text" },
            isUnsend: false,
            deletedFrom: { $nin: [currentUserId] },
        }

        const selection = {
            _id: 1,
            messageType: 1,
            contentUrl: 1
        }

        const media = await chatModel.find(query).sort({ _id: -1 }).select(selection).exec()

        res.send({
            message: errorMessages?.mediaFetched,
            data: media
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
            message: errorMessages?.profilePhotoUpdated,
            data: imageUploadResp?.url
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

        if (globalIoObject?.io) {

            console.log(`emitting online to ${user?._id}`)
            globalIoObject?.io?.emit(`${userActiveChannel}-${user?._id}`, { isActive: false })

        }

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

        if (globalIoObject?.io) {

            console.log(`emitting online to ${user?._id}`)
            globalIoObject?.io?.emit(`${userActiveChannel}-${user?._id}`, { isActive: false })

        }

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