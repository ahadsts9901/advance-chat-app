import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { getMessageType } from "../functions.mjs"
import { chatMessageChannel, cloudinaryChatFilesFolder, imageMessageSize, videoMessageSize, globalIoObject, messageCountChannel } from "../core.mjs"
import { uploadOnCloudinary } from "../utils/cloudinary.mjs"
import { chatModel } from "../models/chatModel.mjs"
import { userModel } from "../models/userModel.mjs"

export const getAllContactsWithChatsController = async (req, res, next) => {
    
    try {
        const currentUserId = req?.currentUser?._id;

        if (!currentUserId || !isValidObjectId(currentUserId)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError,
            });
        }

        // Step 1: Fetch all users
        const allUsers = await userModel.find({}).exec();

        // Step 2: Fetch chats for all users excluding the current user's chats
        const myChats = await chatModel.find({
            $or: [
                { from_id: currentUserId },
                { to_id: currentUserId }
            ],
            deletedFrom: { $nin: [currentUserId] },
            isUnsend: false,
        }).exec();

        // Step 3: Build contacts array
        const contactsWithChats = allUsers
            .map((user) => {
                // Filter chats involving the current user and the current user
                const userChats = myChats.filter((chat) =>
                    (chat.from_id.toString() === user._id.toString() || chat.to_id.toString() === user._id.toString())
                );

                if (userChats.length === 0) {
                    return null; // No chats, skip this user
                }

                // Get the last message
                const lastMessage = userChats.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))[0];

                return {
                    _id: user._id,
                    profilePhoto: user.profilePhoto,
                    userName: user.userName,
                    lastMessage: lastMessage?.text || "",
                    status: lastMessage?.status || "",
                    messageType: lastMessage?.messageType || "",
                    time: lastMessage ? new Date(lastMessage.createdOn).toLocaleString() : "",
                    isReceived: lastMessage ? lastMessage.to_id.toString() === currentUserId.toString() : false
                };
            })
            .filter(contact => contact !== null); // Remove users with no chats

        // Remove current user from contacts array
        const users = contactsWithChats
            .filter(contact => contact._id.toString() !== currentUserId.toString())
            .sort((a, b) => new Date(b.time) - new Date(a.time));

        const myChatQuery = {
            from_id: currentUserId,
            to_id: currentUserId,
            isUnsend: false,
            deletedFrom: { $nin: [currentUserId] },
        };

        const myChat = await chatModel.find(myChatQuery).sort({ createdOn: -1 }).limit(1).exec();
        const currentUser = await userModel.findById(currentUserId);

        if (!currentUser) {
            return res.status(401).send({
                message: errorMessages?.unAuthError,
            });
        }

        const myUser = {
            _id: currentUserId,
            contactId: currentUserId,
            userName: currentUser?.userName,
            profilePhoto: currentUser?.profilePhoto,
            lastMessage: myChat[0]?.text || "",
            status: myChat[0]?.status || "",
            messageType: myChat[0]?.messageType || "",
            time: myChat[0]?.createdOn || "",
            isReceived: false,
        };

        users.unshift(myUser);

        return res.send({
            message: errorMessages?.contactsFetched,
            data: users,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message,
        });
    }
}

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

        const createMessageResp = await chatModel?.create({
            from_id: from_id,
            to_id: to_id,
            text: text ? text : null,
            status: opponentUser?.isActive ? "delievered" : status,
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