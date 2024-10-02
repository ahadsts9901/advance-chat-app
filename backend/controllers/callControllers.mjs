import { isValidObjectId } from "mongoose"
import { errorMessages } from "../errorMessages.mjs"
import { endVideoCallChannel, endVoiceCallChannel, globalIoObject, requestVideoCallChannel, requestVoiceCallChannel, startVideoCallChannel, startVoiceCallChannel } from "../core.mjs"
import { userModel } from "../models/userModel.mjs"

export const requestVideoCallController = async (req, res) => {

    const currentUserId = req?.currentUser?._id
    const { opponentId } = req?.params

    if (!currentUserId || currentUserId?.trim() === "" || !isValidObjectId(currentUserId)) {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!opponentId || opponentId?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.idIsMissing
        })
    }

    if (!isValidObjectId(opponentId)) {
        return res.status(400).send({
            message: errorMessages?.invalidId
        })
    }

    const opponentUser = await userModel.findById(opponentId, { password: 0 }).exec()

    if (!opponentUser) {
        return res.send({
            message: errorMessages?.noAccountFound
        })
    }

    const currentUser = await userModel.findById(currentUserId, { password: 0 }).exec()

    if (!currentUser) {
        return res.send({
            message: errorMessages?.unAuthError
        })
    }

    const videoCallPayload = {
        opponentUser: opponentUser,
        currentUser: currentUser,
        roomId: `${requestVideoCallChannel}-${opponentId}-${currentUserId}`
    }

    if (globalIoObject?.io) {
        console.log(`requesting video call to ${opponentId}`)
        globalIoObject?.io?.emit(`${requestVideoCallChannel}-${opponentId}`, videoCallPayload)
    }

    try {

        return res.send({
            message: errorMessages?.videoCallRequested,
            data: videoCallPayload
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

    const currentUserId = req?.currentUser?._id
    const { opponentId } = req?.params
    const { isRoomCreated, isLobby, is_accepted_call, is_lobby_call } = req?.body

    if (!currentUserId || currentUserId?.trim() === "" || !isValidObjectId(currentUserId)) {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!opponentId || opponentId?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.idIsMissing
        })
    }

    if (!isValidObjectId(opponentId)) {
        return res.status(400).send({
            message: errorMessages?.invalidId
        })
    }

    const opponentUser = await userModel.findById(opponentId, { password: 0 }).exec()

    if (!opponentUser) {
        return res.send({
            message: errorMessages?.noAccountFound
        })
    }

    const currentUser = await userModel.findById(currentUserId, { password: 0 }).exec()

    if (!currentUser) {
        return res.send({
            message: errorMessages?.unAuthError
        })
    }

    const payload = {
        endVideoCall: true,
        isRoomCreated, isLobby, is_accepted_call, is_lobby_call
    }

    if (globalIoObject?.io) {
        console.log(`ending video call to ${opponentId}`)
        globalIoObject?.io?.emit(`${endVideoCallChannel}-${opponentId}`, payload)
    }

    try {

        return res.send({
            message: errorMessages?.videoCallEnded,
            data: payload
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

    const { videoCallData } = req?.body

    if (!videoCallData) {
        return res.status(400).send({
            message: errorMessages?.noVideoCallData
        })
    }

    const payload = {
        id_1: videoCallData?.currentUser?._id,
        id_2: videoCallData?.opponentUser?._id,
        room_id: `video-call-${videoCallData?.currentUser?._id}-${videoCallData?.opponentUser?._id}`
    }

    try {

        res.send({
            message: errorMessages?.videoCallStarted,
            data: payload
        })

        if (globalIoObject?.io) {
            console.log(`emitting video call`)
            globalIoObject?.io?.emit(startVideoCallChannel, payload)
        }

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}

export const requestVoiceCallController = async (req, res) => {

    const currentUserId = req?.currentUser?._id
    const { opponentId } = req?.params

    if (!currentUserId || currentUserId?.trim() === "" || !isValidObjectId(currentUserId)) {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!opponentId || opponentId?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.idIsMissing
        })
    }

    if (!isValidObjectId(opponentId)) {
        return res.status(400).send({
            message: errorMessages?.invalidId
        })
    }

    const opponentUser = await userModel.findById(opponentId, { password: 0 }).exec()

    if (!opponentUser) {
        return res.send({
            message: errorMessages?.noAccountFound
        })
    }

    const currentUser = await userModel.findById(currentUserId, { password: 0 }).exec()

    if (!currentUser) {
        return res.send({
            message: errorMessages?.unAuthError
        })
    }

    const voiceCallPayload = {
        opponentUser: opponentUser,
        currentUser: currentUser,
        roomId: `${requestVoiceCallChannel}-${opponentId}-${currentUserId}`
    }

    if (globalIoObject?.io) {
        console.log(`requesting voice call to ${opponentId}`)
        globalIoObject?.io?.emit(`${requestVoiceCallChannel}-${opponentId}`, voiceCallPayload)
    }

    try {

        return res.send({
            message: errorMessages?.voiceCallRequested,
            data: voiceCallPayload
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

    const currentUserId = req?.currentUser?._id
    const { opponentId } = req?.params
    const { isRoomCreated, isLobby, is_accepted_call, is_lobby_call } = req?.body

    if (!currentUserId || currentUserId?.trim() === "" || !isValidObjectId(currentUserId)) {
        return res.status(401).send({
            message: errorMessages?.unAuthError
        })
    }

    if (!opponentId || opponentId?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.idIsMissing
        })
    }

    if (!isValidObjectId(opponentId)) {
        return res.status(400).send({
            message: errorMessages?.invalidId
        })
    }

    const opponentUser = await userModel.findById(opponentId, { password: 0 }).exec()

    if (!opponentUser) {
        return res.send({
            message: errorMessages?.noAccountFound
        })
    }

    const currentUser = await userModel.findById(currentUserId, { password: 0 }).exec()

    if (!currentUser) {
        return res.send({
            message: errorMessages?.unAuthError
        })
    }

    const payload = {
        endVideoCall: true,
        isRoomCreated, isLobby, is_accepted_call, is_lobby_call
    }

    if (globalIoObject?.io) {
        console.log(`ending video call to ${opponentId}`)
        globalIoObject?.io?.emit(`${endVoiceCallChannel}-${opponentId}`, payload)
    }

    try {

        return res.send({
            message: errorMessages?.voiceCallEnded,
            data: payload
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

    const { voiceCallData } = req?.body

    if (!voiceCallData) {
        return res.status(400).send({
            message: errorMessages?.noVoiceCallData
        })
    }

    const payload = {
        id_1: voiceCallData?.currentUser?._id,
        id_2: voiceCallData?.opponentUser?._id,
        room_id: `voice-call-${voiceCallData?.currentUser?._id}-${voiceCallData?.opponentUser?._id}`
    }

    try {

        res.send({
            message: errorMessages?.voiceCallStarted,
            data: payload
        })

        if (globalIoObject?.io) {
            console.log(`emitting voice call`)
            globalIoObject?.io?.emit(startVoiceCallChannel, payload)
        }

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }

}