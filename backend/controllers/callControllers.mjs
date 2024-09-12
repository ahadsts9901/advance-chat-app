import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"

export const requestVideoCallController = async (req, res) => {

    const currentUserId = req?.currentUser?._id
    const { opponentId } = req?.params

    if (!currentUserId || currentUserId?.trim() === "" || !isValidObjectId(currentUserId)) {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!opponentId || opponentId?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.idIsMissing
        })
    }

    if (!isValidObjectId(opponentId)) {
        return res.status(400).send({
            message: errorMessages?.invalidId
        })
    }

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const acceptVideoCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const declineVideoCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const requestVoiceCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const acceptVoiceCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const declineVoiceCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}