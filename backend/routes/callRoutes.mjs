import { Router } from "express";
import { acceptVideoCallController, acceptVoiceCallController, declineVideoCallController, declineVoiceCallController, requestVideoCallController, requestVoiceCallController } from "../controllers/callControllers.mjs";

const router = Router()

router.post("/request-video-call", requestVideoCallController)

router.post("/accept-video-call", acceptVideoCallController)

router.post("/decline-video-call", declineVideoCallController)

router.post("/request-voice-call", requestVoiceCallController)

router.post("/accept-voice-call", acceptVoiceCallController)

router.post("/decline-voice-call", declineVoiceCallController)

export default router