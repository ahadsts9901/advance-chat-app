import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { userModel } from "../models/userModel.mjs"
import { chatModel } from "../models/chatModel.mjs"

export const getAllContactsWithChatsController = async (req, res, next) => {

    try {

        const currentUserId = req?.currentUser?._id;

        if (!currentUserId || !isValidObjectId(currentUserId)) {
            return res.status(401).send({
                message: errorMessages?.unAuthError,
            });
        }

        const allUsers = await userModel.find({}).exec();

        const myChats = await chatModel.find({
            $or: [
                { from_id: currentUserId },
                { to_id: currentUserId }
            ],
            deletedFrom: { $nin: [currentUserId] },
            isUnsend: false,
        }).exec();

        const contactsWithChats = allUsers
            .map((user) => {

                const userChats = myChats.filter((chat) =>
                    (chat.from_id.toString() === user._id.toString() || chat.to_id.toString() === user._id.toString())
                );

                if (userChats.length === 0) {
                    return null;
                }

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
            .filter(contact => contact !== null);

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

export const getAllUsersController = async (req, res, next) => {

    try {

        const users = await userModel.find({}).sort({ userName: 1 }).exec()

        return res.send({
            message: errorMessages?.usersFetched,
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