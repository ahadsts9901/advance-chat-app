import { Router } from "express";
import { createMessageController, deleteMessageForEveryoneController, deleteMessageForMeController, delivereMessagesController, getMessagesController, getNewMessagesCountController, readMessagesController, updateMessageController } from "../controllers/chatControllers.mjs";
import { upload } from "../utils/multer.mjs"

const router = Router()

router.post("/chats/:to_id", upload?.any(), createMessageController)

router.get("/chats/:to_id", getMessagesController)

router.get("/unread-messages/:to_id", getNewMessagesCountController)

router.put("/mark-messages-delievered", delivereMessagesController)

router.put("/mark-messages-read/:userId", readMessagesController)

router.put("/delete-message-for-me/:messageId", deleteMessageForMeController)

router.put("/delete-message-for-everyone/:messageId", deleteMessageForEveryoneController)

router.put("/chats/:messageId", updateMessageController)

export default router