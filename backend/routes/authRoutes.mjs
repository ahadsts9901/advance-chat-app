import { Router } from "express";
import { googleLoginController, loginController, signupController } from "../controllers/authControllers.mjs";
import { issueLoginToken } from "../middlewares/jwtMiddlewares.mjs"

const router = Router()

router.post("/signup", signupController, issueLoginToken, (req, res) => res.send({ message: "signup successfull" }))

router.post("/login", loginController, issueLoginToken, (req, res) => res.send({ message: "login successfull" }))

router.post("/google-login", googleLoginController, issueLoginToken, (req, res) => res.send({ message: "google login successfull", data: req?.loginTokenPayload }))

export default router