import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { getMessageType } from "../functions.mjs"
import { cloudinaryChatFilesFolder, imageMessageSize, videoMessageSize } from "../core.mjs"
import { uploadOnCloudinary } from "../utils/cloudinary.mjs"
import { chatModel } from "../models/chatModel.mjs"

export const getAllContactsWithChatsController = async (req, res, next) => {

    try {



    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const createMessageController = async (req, res, next) => {

    try {

        const from_id = req?.currentUser?._id
        const to_id = req?.params?.to_id
        const text = req?.body?.text
        const readBy = [req?.currentUser?._id]
        const status = 'sent'
        const deletedFrom = []
        const isUnsend = false

        const messageType = getMessageType(req?.files)

        if (!from_id || !isValidObjectId(from_id)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        if (!to_id) {
            return res.status(400).send({
                message: errorMessages?.idIsMissing
            })
        }

        if (!isValidObjectId(to_id)) {
            return res.status(400).send({
                message: errorMessages?.invalidId
            })
        }

        if (!req?.files && !text && text?.trim() === "") {
            return res.status(400).send({
                message: errorMessages?.emptyMessageError
            })
        }

        if (!messageType || messageType?.trim() === "") {
            return res.status(400).send({
                message: errorMessages?.serverError
            })
        }

        if (messageType !== 'text') {

            const file = req?.files[0]

            if (messageType === 'image' && file?.size > imageMessageSize) {
                return res.status(400).send({
                    message: errorMessages?.imageMessageSizeError
                })
            }

            if (messageType === 'video' && file?.size > videoMessageSize) {
                return res.status(400).send({
                    message: errorMessages?.videoMessageSizeError
                })
            }

        }

        var contentUrl = ""

        if (messageType !== 'text') {

            const fileResp = await uploadOnCloudinary(req?.files[0], cloudinaryChatFilesFolder)

            contentUrl = fileResp?.url

        } else {
            contentUrl = null
        }

        const cerateMessageResp = await chatModel?.create({
            from_id: from_id,
            to_id: to_id,
            text: text ? text : null,
            readBy: readBy,
            status: status,
            deletedFrom: deletedFrom,
            isUnsend: isUnsend,
            messageType: messageType,
            contentUrl: contentUrl ? contentUrl : null
        })

        res.send({
            message: errorMessages?.messageSend
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}