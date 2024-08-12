import { Router } from "express";
import { getCurrentUserProfileController, getUserProfileController, logoutController, updateProfilePictureController, updateUserNameController } from "../controllers/profileControllers.mjs"
import { upload } from "../utils/multer.mjs"

const router = Router()

router.put('/logout', logoutController)

router.get("/profile", getCurrentUserProfileController)

router.get("/profile/:userId", getUserProfileController)

router.put('/username', updateUserNameController)

router.put('/profile-picture', upload.any(), updateProfilePictureController)


export default router