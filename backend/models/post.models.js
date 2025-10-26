import mongoose, { Schema } from "mongoose";
import { User } from "./user.models.js";

const postSchema = new Schema({

    caption: String,

    post: {
        id: String,
        secure_url: String,
        resource_type: String,
    },

    type: {
        type: String,
        enum: ["post", "reel"],
        required: true,
    },

    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }

        }
    ]

}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);