export const baseUrl = "http://localhost:5002"

export const _1mbSize = 10000000 // 1_mb
export const imageMessageSize = _1mbSize * 5
export const videoMessageSize = _1mbSize * 25
export const cloudinaryChatFilesFolder = "advance-chat-app/chat-files"
export const fallBackProfileImage = "https://res.cloudinary.com/do6sd9nyx/image/upload/v1725535697/default_avatar_avhpw8.png"

// socket.io channels
export const chatMessageChannel = "chat-message"
export const userActiveChannel = "user-active"
export const messageCountChannel = "message-count"
export const messageSeenChannel = "message-seen-mark"
export const unsendMessageChannel = "unsend-message"
export const updateMessageChannel = "edit-message"
export const voiceCallChannel = "voice-call"
export const videoCallChannel = "video-call"
export const requestVideoCallChannel = "request-video-call"
export const endVideoCallChannel = "end-video-call"