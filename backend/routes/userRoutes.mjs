import { Router } from "express";
import { getAllContactsWithChatsController, getAllUsersController } from "../controllers/userControllers.mjs"

const router = Router()

router.get("/contacts", getAllContactsWithChatsController)

router.get("/users", getAllUsersController)

export default router