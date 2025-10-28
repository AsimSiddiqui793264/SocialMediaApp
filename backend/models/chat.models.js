import mongoose from "mongoose";
import { User } from "./user.models.js";

const chatSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

    latestMessage: {
        text: {
            type : String,
            required : true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required : true
        }
    }

}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);