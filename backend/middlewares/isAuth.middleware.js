import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import TryCatch from "../utils/trycatch.js";
import dotenv from "dotenv";
dotenv.config();

export const isAuth = TryCatch(async (req, res , next) => {
    const { token } = req.cookies;

    if (!token) {
        return res
            .status(401)
            .json(
                {
                    message: "Unauthorized access"
                }
            )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
        return res
            .status(400)
            .json(
                {
                    message: "Invalid Token"
                }
            )
    }

    req.user = await User.findById(decoded.id);
    next();
})