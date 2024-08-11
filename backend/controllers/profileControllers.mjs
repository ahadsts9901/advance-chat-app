import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { userModel } from "../models/userModel.mjs"

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