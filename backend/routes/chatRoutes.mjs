import { Router } from "express";
import { createMessageController, getAllContactsWithChatsController, getMessagesController, getNewMessagesCountController } from "../controllers/chatControllers.mjs";
import { upload } from "../utils/multer.mjs"

const router = Router()

router.get("/contacts", getAllContactsWithChatsController)

router.post("/chats/:to_id", upload?.any(), createMessageController)

router.get("/chats/:to_id", getMessagesController)

router.get("/unread-messages/:to_id", getNewMessagesCountController)

export default router