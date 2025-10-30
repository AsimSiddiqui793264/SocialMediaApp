import express from "express";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import { followAndUnfollowUser, getAllUsers, myProfie, updatePassword, updateProfile, userFollowersAndFollowingData, userProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.get("/me" , isAuth , myProfie);
router.get("/all" , isAuth , getAllUsers);
router.get("/:id" , isAuth , userProfile);
router.post("/:id" , isAuth , updatePassword);
router.put("/:id" , isAuth , upload , updateProfile);
router.post("/follow/:id" , isAuth , followAndUnfollowUser);
router.get("/followdata/:id" , isAuth , userFollowersAndFollowingData);

export default router;