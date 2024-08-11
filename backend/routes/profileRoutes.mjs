import { Router } from "express";
import { getCurrentUserProfileController, getUserProfileController, updateUserNameController } from "../controllers/profileControllers.mjs"

const router = Router()

router.get("/profile", getCurrentUserProfileController)

router.get("/profile/:userId", getUserProfileController)

router.put('/username', updateUserNameController)

export default router