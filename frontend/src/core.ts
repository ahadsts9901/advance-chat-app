export const baseUrl = "http://localhost:5002"

export const _1mbSize = 10000000 // 1_mb
export const imageMessageSize = _1mbSize * 5
export const videoMessageSize = _1mbSize * 25
export const cloudinaryChatFilesFolder = "advance-chat-app/chat-files"

// socket.io channels
export const chatMessageChannel = "chat-message"
export const userActiveChannel = "user-active"
export const messageCountChannel = "message-count"