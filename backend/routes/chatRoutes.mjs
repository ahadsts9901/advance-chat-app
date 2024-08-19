import { Router } from "express";
import { createMessageController, getAllContactsWithChatsController } from "../controllers/chatControllers.mjs";

const router = Router()

router.get("/contacts", getAllContactsWithChatsController)

router.post("/chats/:to_id", createMessageController)

export default router