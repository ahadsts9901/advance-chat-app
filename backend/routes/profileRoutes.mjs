import { Router } from "express";
import { getCurrentUserProfileController, getProfileMediaController, getUserProfileController, logoutController, updateProfilePictureController, updateUserNameController, userOfflineController } from "../controllers/profileControllers.mjs"
import { upload } from "../utils/multer.mjs"

const router = Router()

router.post('/logout', logoutController)

router.get("/profile", getCurrentUserProfileController)

router.get("/profile/:userId", getUserProfileController)

router.get("/media/:userId", getProfileMediaController)

router.put('/username', updateUserNameController)

router.put('/profile-picture', upload.any(), updateProfilePictureController)

router.put('/user-offline', userOfflineController)

export default router