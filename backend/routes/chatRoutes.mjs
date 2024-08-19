import { Router } from "express";
import { createMessageController, getAllContactsWithChatsController } from "../controllers/chatControllers.mjs";
import { upload } from "../utils/multer.mjs"

const router = Router()

router.get("/contacts", getAllContactsWithChatsController)

router.post("/chats/:to_id", upload?.any(), createMessageController)

export default router