import { Router } from "express";
import { getAllContactsWithChatsController } from "../controllers/chatControllers.mjs";

const router = Router()

router.get("/contacts", getAllContactsWithChatsController)

export default router