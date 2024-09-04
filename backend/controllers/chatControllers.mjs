import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { getMessageType } from "../functions.mjs"
import { chatMessageChannel, cloudinaryChatFilesFolder, imageMessageSize, videoMessageSize, globalIoObject, messageCountChannel, messageSeenChannel, unsendMessageChannel } from "../core.mjs"
import { uploadOnCloudinary } from "../utils/cloudinary.mjs"
import { chatModel } from "../models/chatModel.mjs"
import { userModel } from "../models/userModel.mjs"

export const createMessageController = async (req, res, next) => {

    try {

        const from_id = req?.currentUser?._id
        const to_id = req?.params?.to_id
        const text = req?.body?.text
        const status = from_id == to_id ? "seen" : 'sent'
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

            contentUrl = fileResp?.secure_url

        } else {
            contentUrl = null
        }

        const opponentUser = await userModel.findById(to_id).exec()

        if (!opponentUser) {
            return res.status(500).send({
                message: errorMessages?.noAccountFound
            })
        }

        const _status = status === "seen" ? "seen" : opponentUser?.isActive ? "delievered" : status

        const createMessageResp = await chatModel?.create({
            from_id: from_id,
            to_id: to_id,
            text: text ? text : null,
            status: _status,
            deletedFrom: deletedFrom,
            isUnsend: isUnsend,
            messageType: messageType,
            contentUrl: contentUrl ? contentUrl : null
        })

        if (globalIoObject?.io) {

            console.log(`emitting message to ${to_id}`)
            globalIoObject?.io?.emit(`${chatMessageChannel}-${to_id}`, createMessageResp)
            console.log(`emitting realtime message count to ${from_id}`)
            globalIoObject?.io?.emit(`${messageCountChannel}-${from_id}`)

        }

        res.send({
            message: errorMessages?.messageSend,
            data: createMessageResp
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const getMessagesController = async (req, res, next) => {

    try {

        const from_id = req?.currentUser?._id
        const to_id = req?.params?.to_id

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

        const query = {
            $or: [
                { from_id, to_id },
                { from_id: to_id, to_id: from_id }
            ],
            deletedFrom: { $ne: from_id }
        }

        const messages = await chatModel.find(query).sort({ _id: -1 }).exec()

        res.send({
            message: errorMessages?.messagesFetched,
            data: messages
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const getNewMessagesCountController = async (req, res, next) => {

    try {

        const currentUserId = req?.currentUser?._id
        const opponentId = req?.params?.to_id

        if (!currentUserId || !isValidObjectId(currentUserId)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        if (!opponentId) {
            return res.status(400).send({
                message: errorMessages?.idIsMissing
            })
        }

        if (!isValidObjectId(opponentId)) {
            return res.status(400).send({
                message: errorMessages?.invalidId
            })
        }

        const query = {
            to_id: currentUserId,
            from_id: opponentId,
            deletedFrom: { $ne: currentUserId },
            status: "delievered",
        }

        const unReadMessages = await chatModel.countDocuments(query).exec()

        console.log("unReadMessages", unReadMessages)

        res.send({
            message: errorMessages?.unReadMessagesFetched,
            data: unReadMessages
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const delivereMessagesController = async (req, res, next) => {

    try {

        const { _id } = req?.currentUser

        if (!_id || !isValidObjectId(_id)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError,
            });
        }

        const resp = await chatModel.updateMany(
            {
                to_id: _id,
                status: "sent"
            },
            {
                $set: { status: "delievered" }
            }
        )

        res.send({
            message: errorMessages?.messagesDelievered,
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const readMessagesController = async (req, res, next) => {

    try {

        const currentUserId = req?.currentUser?._id
        const opponentId = req?.params?.userId

        if (!currentUserId || !isValidObjectId(currentUserId)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError,
            });
        }

        if (!opponentId) {
            return res.status(400).send({
                message: errorMessages?.idIsMissing,
            });
        }

        if (!isValidObjectId(opponentId)) {
            return res.status(400).send({
                message: errorMessages?.invalidId,
            });
        }

        const resp = await chatModel.updateMany(
            {
                to_id: currentUserId,
                from_id: opponentId,
                $or: [{ status: "delievered" }, { status: "sent" }]
            },
            {
                $set: { status: "seen" }
            }
        )

        if (globalIoObject?.io) {

            console.log(`emitting seen message mark ${opponentId}`)
            globalIoObject?.io?.emit(`${messageSeenChannel}-${opponentId}`, { opponentId: opponentId })

        }

        res.send({
            message: errorMessages?.messagesRead,
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const deleteMessageForMeController = async (req, res, next) => {

    try {

        const currentUserId = req?.currentUser?._id
        const messageId = req?.params?.messageId

        if (!currentUserId || !isValidObjectId(currentUserId)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError,
            });
        }

        if (!messageId) {
            return res.status(400).send({
                message: errorMessages?.idIsMissing,
            });
        }

        if (!isValidObjectId(messageId)) {
            return res.status(400).send({
                message: errorMessages?.invalidId,
            });
        }

        const message = await chatModel.findById(messageId).exec()

        if (!message) {
            return res.status(404).send({
                message: errorMessages?.messageNotFound,
            });
        }

        const resp = await chatModel.findByIdAndUpdate(
            messageId,
            {
                $addToSet: { deletedFrom: currentUserId }
            },
            { new: true }
        );

        res.send({
            message: errorMessages?.messageDeletedForMe,
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const deleteMessageForEveryoneController = async (req, res, next) => {

    try {

        const currentUserId = req?.currentUser?._id
        const messageId = req?.params?.messageId

        if (!currentUserId || !isValidObjectId(currentUserId)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError,
            });
        }

        if (!messageId) {
            return res.status(400).send({
                message: errorMessages?.idIsMissing,
            });
        }

        if (!isValidObjectId(messageId)) {
            return res.status(400).send({
                message: errorMessages?.invalidId,
            });
        }

        const message = await chatModel.findById(messageId).exec()

        if (!message) {
            return res.status(404).send({
                message: errorMessages?.messageNotFound,
            });
        }

        if (message?.from_id?.toString() !== currentUserId?.toString()) {
            return res.status(401).send({
                message: errorMessages?.unAuthError,
            });
        }

        const resp = await chatModel.findByIdAndUpdate(
            messageId,
            { isUnsend: true }
        );

        if (globalIoObject?.io) {

            console.log(`emitting unsend message to ${currentUserId}`)
            globalIoObject?.io?.emit(`${unsendMessageChannel}-${currentUserId}`, { messageId: messageId })

        }

        res.send({
            message: errorMessages?.messageDeletedForEveryone,
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}