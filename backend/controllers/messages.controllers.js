import { Chat } from "../models/chat.models.js";
import { Message } from "../models/message.models.js";
import TryCatch from "../utils/trycatch.js";

export const sendMessages = TryCatch(async (req, res) => {
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

    };

    const newMessage = new Message({
        chatId: chat._id,
        sender: senderId,
        text: message,
    });

    await newMessage.save();

    await newMessage.populate("sender");

    chat.latestMessage = {
        text: message,
        sender: senderId,
    };

    await chat.save();

    return res
        .status(201)
        .json(
            {
                message: "Message send successfully",
                data: newMessage,
            }
        );

});

export const getAllMessages = TryCatch(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne(
        {
            users: { $all: [userId, chatId] }
        }
    );

    if (!chat) {
        return res
            .status(404)
            .json(
                {
                    message: "Chat not found"
                }
            )
    };

    const messages = await Message.find(
        {
            chatId: chat._id
        }
    );

    return res
    .status(200)
    .json(
        {
            message : "Messages fetched successfully",
            data : messages,
        }
    );
});

export const getChats = TryCatch(async (req , res) =>{
    const chat = await Chat.find(req.user._id)
    .populate("users" , "-password");

    res.json(chat)
})