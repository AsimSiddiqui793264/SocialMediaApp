import { User } from "./user.models.js";
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        text: String,
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);