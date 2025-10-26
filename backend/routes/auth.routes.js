import express from "express";
import  {loginUser, logoutUser, registerUser} from "../controllers/auth.controllers.js";
import upload from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.post("/register" , upload , registerUser)
router.post("/login" , loginUser)
router.get("/logout" , logoutUser)

export default router;