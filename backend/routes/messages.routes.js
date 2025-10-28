import express from "express";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import { sendMessages } from "../controllers/messages.controllers.js";

const router = express.Router();

router.post("/send" , isAuth , sendMessages);

export default router;