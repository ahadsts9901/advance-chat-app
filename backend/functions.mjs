export const getMessageType = (files) => {

    if (!files || !files[0]) {
        return 'text'
    }

    const file = files[0]

    if (!file) return "text"
    if (file?.mimetype?.startsWith("image")) return "image"
    if (file?.mimetype?.startsWith("video")) return "video"
    if (file?.mimetype?.startsWith("audio")) return "audio"

}