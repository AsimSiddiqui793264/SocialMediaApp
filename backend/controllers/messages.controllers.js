import { text } from "express";
import { Chat } from "../models/chat.models.js";
import { Message } from "../models/message.models.js";
import TryCatch from "../utils/trycatch.js";

export const sendMessagse = TryCatch(async (req, res) => {
    const { receiverId, message } = req.body;

    if (!receiverId) {
        return res
            .status(400)
            .json(
                {
                    message: "ReceiverId is required"
                }
            )
    }

    const senderId = req.user._id;

    let chat = await Chat.findOne({
        users: { $all: [senderId, receiverId] }
    });

    if (!chat) {
        chat = new Chat({
            users: [senderId, receiverId],
            latestMessage: {
                text: message,
                sender: senderId,
            }
        });

        await chat.save();

        // return res
        //     .status(200)
        //     .json(
        //         {
        //             message: "Chat created and message send successfully"
        //         }
        //     )

 const newMessage = new Message({
        chatId: chat._id,
        sender: senderId,
        text: message,
    });

    await newMessage.save();

    await chat.updateOne({
        latestMessage: {
            text: message,
            sender: senderId,
        }
    });

    return res
        .status(201)
        .json(
            {
                message: "Message send successfully",
                data: newMessage,
            }
        );

    };

   

});