import { Router } from "express";
import { createMessageController, deleteMessageForMeController, delivereMessagesController, getMessagesController, getNewMessagesCountController, readMessagesController } from "../controllers/chatControllers.mjs";
import { upload } from "../utils/multer.mjs"

const router = Router()

router.post("/chats/:to_id", upload?.any(), createMessageController)

router.get("/chats/:to_id", getMessagesController)

router.get("/unread-messages/:to_id", getNewMessagesCountController)

router.put("/mark-messages-delievered", delivereMessagesController)

router.put("/mark-messages-read/:userId", readMessagesController)

router.put("/delete-message-for-me/:messageId", deleteMessageForMeController)

export default router