import express from "express";
import isAuth from "../middlewares/isAuth.middleware.js";
import { sendMessagse } from "../controllers/messages.controllers.js";

const router = express.Router();

router.post("/send" , isAuth , sendMessagse);

export default router;