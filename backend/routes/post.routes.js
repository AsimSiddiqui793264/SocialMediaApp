import express from "express";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";
import { 
    commentonPost
    , createPost
    , deleteComment
    , deletePost
    , editCaption
    , editPost
    , getAllPosts
    , likeUnlikePost 
} from "../controllers/post.controllers.js";

const router = express.Router();

router.post("/createpost" , isAuth , upload , createPost);
router.delete("/deletepost/:id" , isAuth , deletePost);
router.get("/getallposts" , isAuth , getAllPosts);
router.post("/like/:id" , isAuth , likeUnlikePost);
router.post("/comment/:id" , isAuth , commentonPost);
router.delete("/comment/:id" , isAuth , deleteComment);
router.put("/editcaption/:id" , isAuth , editCaption)
router.post("/editpost/:id" , isAuth , upload , editPost)

export default router;