import { User } from "./user.models.js";
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required : true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    text: {
        type : String,
        required : true,
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);