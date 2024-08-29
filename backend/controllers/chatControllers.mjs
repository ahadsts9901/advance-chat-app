import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { getMessageType } from "../functions.mjs"
import { cloudinaryChatFilesFolder, imageMessageSize, videoMessageSize } from "../core.mjs"
import { uploadOnCloudinary } from "../utils/cloudinary.mjs"
import { chatModel } from "../models/chatModel.mjs"
import { userModel } from "../models/userModel.mjs"

export const getAllContactsWithChatsController = async (req, res, next) => {

    // {
    //     profilePhoto: "",
    //     lastMessage: "Hello man",
    //     status: "read",
    //     messageType: "text",
    //     userName: "Thomas Edison",
    //     time: "August 12, 2024, 04:50 PM",
    //     _id: "66b9da4e5580a4580fd65c22",
    //     isRecieved: false
    // },

    try {

        const currentUserId = req?.currentUser?._id

        if (!currentUserId || !isValidObjectId(currentUserId)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        const userIds = await chatModel.distinct('from_id', { $or: [{ to_id: currentUserId }, { from_id: currentUserId }] });
        const toUserIds = await chatModel.distinct('to_id', { $or: [{ to_id: currentUserId }, { from_id: currentUserId }] });

        const allUserIds = [...new Set([...userIds, ...toUserIds])]; // Ensure unique user IDs

        const pipeline = [
            {
                $match: {
                    _id: { $in: allUserIds }
                }
            },
            {
                $lookup: {
                    from: "chats",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $or: [
                                                { $eq: ["$from_id", "$$userId"] },
                                                { $eq: ["$to_id", "$$userId"] }
                                            ]
                                        },
                                        { $ne: ["$deletedFrom", "$$userId"] },
                                        { $eq: ["$isUnsend", false] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdOn: -1 } },
                        { $limit: 1 }
                    ],
                    as: "lastMessage"
                }
            },
            {
                $unwind: {
                    path: "$lastMessage",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    profilePhoto: "$profilePhoto",
                    lastMessage: "$lastMessage.text",
                    status: {
                        $cond: {
                            if: {
                                $in: [
                                    {
                                        $cond: {
                                            if: { $eq: ["$lastMessage.from_id", "$_id"] },
                                            then: "$lastMessage.to_id",
                                            else: "$lastMessage.from_id"
                                        }
                                    },
                                    { $ifNull: ["$lastMessage.readBy", []] }
                                ]
                            },
                            then: "read",
                            else: "sent"
                        }
                    },
                    messageType: "$lastMessage.messageType",
                    userName: "$userName",
                    time: {
                        $dateToString: {
                            format: "%Y-%m-%d %H:%M:%S",
                            date: "$lastMessage.createdOn"
                        }
                    },
                    isRecieved: {
                        $cond: {
                            if: { $eq: ["$lastMessage.from_id", "$_id"] },
                            then: true,
                            else: false
                        }
                    },
                    contactId: {
                        $cond: {
                            if: { $eq: ["$lastMessage.from_id", "$_id"] },
                            then: "$lastMessage.to_id",
                            else: "$lastMessage.from_id"
                        }
                    }
                }
            },
            {
                $sort: { time: -1 }
            },
            {
                $project: {
                    profilePhoto: 1,
                    lastMessage: 1,
                    status: 1,
                    messageType: 1,
                    userName: 1,
                    time: 1,
                    isRecieved: 1,
                    contactId: 1 // Include the contact ID of the opposite user
                }
            }
        ];

        const allUsers = await userModel.aggregate(pipeline);

        res.send({
            message: errorMessages?.contactsFetched,
            data: allUsers
        })

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

            contentUrl = fileResp?.secure_url

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