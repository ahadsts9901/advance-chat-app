import { errorMessages } from "../errorMessages.mjs"

export const getAllContactsWithChatsController = async (req, res, next) => {

    try {



    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const createMessageController = async (req, res, next) => {

    try {



    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

