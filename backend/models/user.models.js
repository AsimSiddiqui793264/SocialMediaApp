import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    gender : {
        type : String,
        required : true,
        enum : ["male" , "female"]
    },
    followers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }] ,
    following : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }] ,
    profilePic : {
        id : String,
        url : String
    }


}, { timestamps: true });

export const User = mongoose.model("User" , userSchema);
