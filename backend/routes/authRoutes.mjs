import { Router } from "express";
import { signupController } from "../controllers/authControllers.mjs";
import { issueLoginToken } from "../middlewares/jwtMiddlewares.mjs"

const router = Router()

router.post("/signup", signupController, issueLoginToken, (req, res) => res.send({ message: "signup successfull" }))

export default router