import { Router } from "express";
import { acceptVideoCallController, acceptVoiceCallController, declineVideoCallController, declineVoiceCallController, requestVideoCallController, requestVoiceCallController } from "../controllers/callControllers.mjs";

const router = Router()

router.post("/request-video-call/:opponentId", requestVideoCallController)

router.post("/decline-video-call/:opponentId", declineVideoCallController)

router.post("/accept-video-call", acceptVideoCallController)

router.post("/request-voice-call", requestVoiceCallController)

router.post("/decline-voice-call", declineVoiceCallController)

router.post("/accept-voice-call", acceptVoiceCallController)

export default router