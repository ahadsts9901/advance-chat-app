import { emailPattern, passwordPattern, userNamePattern } from "../core.mjs"
import { errorMessages } from "../errorMessages.mjs"
import { userModel } from "../models/userModel.mjs"
import { hash } from "bcrypt"

export const signupController = async (req, res, next) => {

    const { userName, email, password } = req?.body

    if (!userName || userName?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.userNameRequired
        })
    }

    if (!email || email?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.emailRequired
        })
    }

    if (!password || password?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.passwordRequired
        })
    }

    if (!userNamePattern?.test(userName)) {
        return res.status(400).send({
            message: errorMessages?.userNameInvalid
        })
    }

    if (!emailPattern?.test(email?.toLowerCase())) {
        return res.status(400).send({
            message: errorMessages?.emailInvalid
        })
    }

    if (!passwordPattern?.test(password)) {
        return res.status(400).send({
            message: errorMessages?.passwordInvalid
        })
    }

    try {

        const isEmailTaken = await userModel?.findOne({ email: email }).exec()

        if (isEmailTaken) {
            return res.status(400).send({
                message: errorMessages.emailTaken
            })
        }

        const passwordHash = await hash(password, 12)

        const userPayload = {
            userName: userName,
            email: email?.toLowerCase(),
            password: passwordHash,
        }

        const signupResp = await userModel?.create(userPayload)

        const tokenPayload = {
            userName: signupResp?.userName,
            email: signupResp?.email?.toLowerCase(),
            createdOn: signupResp?.createdOn,
            isAdmin: signupResp?.isAdmin,
            profilePhoto: signupResp?.profilePhoto
        }

        req.loginTokenPayload = tokenPayload

        next()

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}