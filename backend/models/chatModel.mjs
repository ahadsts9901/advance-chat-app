import { Schema, model } from "mongoose";

let chatSchema = new Schema({

    content: {
        type: String,
        default: null,
        maxlength: 1000,
    },

    text: {
        type: String,
        default: null
    },

    isActive: {
        type: Boolean,
        default: false
    },

    createdOn: {
        type: Date,
        default: Date.now
    }

});

let chatModel;

try {

    chatModel = model('chats');

} catch (error) {

    chatModel = model('chats', chatSchema);

}

export { chatModel };