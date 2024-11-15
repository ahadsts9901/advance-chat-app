export const userNamePattern = /^[\p{L}\p{N}\p{P}\p{S} !@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{2,15}$/u;
export const emailPattern = /^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?!.*\s{2})[a-zA-Z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,24}$/;
export const otpPattern = /^[a-zA-Z0-9]{6}$/
export const defaultProfilePicture = "https://res.cloudinary.com/do6sd9nyx/image/upload/v1725535697/default_avatar_avhpw8.png"

export const sessionInDays = 15;
export const _1mbSize = 10000000 // 1_mb
export const imageMessageSize = _1mbSize * 5
export const videoMessageSize = _1mbSize * 25
export const cloudinaryChatFilesFolder = "advance-chat-app/chat-files"

export const welcomeEmailSubject = "Welcome to STS Chat"
export const emailVerificationSubject = "Email verification OTP"

export const googleUserApi = "https://www.googleapis.com/oauth2/v3/userinfo"

export const profilePictureUploadFolder = "advance-chat-app/profile-pictures"

export const allowedOrigins = "http://localhost:5173"
export let globalIoObject = { io: null }

// socket.io channels
export const chatMessageChannel = "chat-message"
export const userActiveChannel = "user-active"
export const messageCountChannel = "message-count"
export const messageSeenChannel = "message-seen-mark"
export const unsendMessageChannel = "unsend-message"
export const updateMessageChannel = "edit-message"
export const requestVideoCallChannel = "request-video-call"
export const endVideoCallChannel = "end-video-call"
export const startVideoCallChannel = "video-call"
export const requestVoiceCallChannel = "request-voice-call"
export const endVoiceCallChannel = "end-voice-call"
export const startVoiceCallChannel = "voice-call"