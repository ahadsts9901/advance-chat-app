export const requestVideoCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const acceptVideoCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const declineVideoCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const requestVoiceCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const acceptVoiceCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const declineVoiceCallController = async (req, res) => {

    try {

        res.send({
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}