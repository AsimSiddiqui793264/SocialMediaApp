import { User } from "../models/user.models.js";
import getDataUri from "../utils/urlgenerator.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.utils.js";
import TryCatch from "../utils/trycatch.js";

export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password, gender } = req.body

    const file = req.file;

    if (!name || !email || !password || !gender || !file) {
        return res
            .status(400)
            .json(
                {
                    message: "All fields are required"
                }
            )
    }

    let user = await User.findOne({ email })

    if (user) {
        return res
            .status(400)
            .json(
                {
                    message: "User already exists"
                }
            )
    }

    const fileUrl = getDataUri(file);
    const hashPassword = await bcrypt.hash(password, 10);
    const mycloud = await cloudinary.uploader.upload(fileUrl.content);

    user = await User.create(
        {
            name,
            email,
            password: hashPassword,
            gender,
            profilePic: {
                id: mycloud.public_id,
                url: mycloud.secure_url
            }
        }
    )

    generateToken(user._id, res);
    return res
        .status(201)
        .json(
            {
                message: "User registered successfully",
                user
            }
        )
});

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json(
                {
                    message: "All fields are required"
                }
            )
    };

    const user = await User.findOne({ email });

    if (!user) {
        return res
            .status(400)
            .json(
                {
                    message: "invalid credentials"
                }
            )
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        return res
            .status(40)
            .json(
                {
                    message: "invalid credentials"
                }
            )
    }

    generateToken(user._id, res);

    return res
        .status(200)
        .json(
            {
                message: "User Logged in successfully",
                user
            }
        )

});

export const logoutUser = TryCatch((req, res) => {
    res.cookie("token", "", { maxAge: 0 });

    return res
        .json(
            {
                message: "User logged out successfully"
            }
        )
});