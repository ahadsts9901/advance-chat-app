import { Router } from "express";
import { getCurrentUserProfileController, getUserProfileController } from "../controllers/profileControllers.mjs"

const router = Router()

router.get("/profile", getCurrentUserProfileController)

router.get("/profile/:userId", getUserProfileController)

export default router