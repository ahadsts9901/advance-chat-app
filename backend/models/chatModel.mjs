import { Schema, model } from "mongoose";

let chatSchema = new Schema({

    from_id: {
        type: Schema.Types.ObjectId,
        required: true
    },

    to_id: {
        type: Schema.Types.ObjectId,
        required: true
    },

    text: {
        type: String,
        default: null
    },

    createdOn: {
        type: Date,
        default: Date.now
    },

    content: {
        type: String,
        default: null,
        maxlength: 1000,
    },

    readBy: {
        type: [
            {
                type: Schema.Types.ObjectId,
                required: true
            }
        ]
    },

    status: {
        type: String,
        enum: ['sent', 'delievered', 'seen', 'unsend'],
        required: true,
    },

    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'audio'],
        required: true,
    },

    deletedFrom: {
        type: [
            {
                type: Schema.Types.ObjectId,
            }
        ]
    },

    isUnsend: {
        type: Boolean,
        default: false
    },

});

let chatModel;

try {

    chatModel = model('chats');

} catch (error) {

    chatModel = model('chats', chatSchema);

}

export { chatModel };