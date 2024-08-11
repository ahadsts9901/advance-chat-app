import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { userModel } from "../models/userModel.mjs"
import { userNamePattern } from "../core.mjs"

export const getCurrentUserProfileController = async (req, res, next) => {

    try {

        const currentUser = { req }

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

    try {

        const userId = req?.params

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

        user?.userName = userName?.trim()

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