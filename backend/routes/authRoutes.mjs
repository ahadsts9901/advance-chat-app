import { Router } from "express";
import { loginController, signupController } from "../controllers/authControllers.mjs";
import { issueLoginToken } from "../middlewares/jwtMiddlewares.mjs"

const router = Router()

router.post("/signup", signupController, issueLoginToken, (req, res) => res.send({ message: "signup successfull" }))

router.post("/login", loginController, issueLoginToken, (req, res) => res.send({ message: "login successfull" }))

export default router