import getDataUri from "../utils/urlgenerator.js";
import TryCatch from "../utils/trycatch.js";
import { Post } from "../models/post.models.js";
import cloudinary from "cloudinary";


export const createPost = TryCatch(async (req, res) => {

    const { caption } = req.body;

    const loginUserId = req.user._id;

    const file = req.file;
    const fileUrl = getDataUri(file);

    let option;

    const type = req.query.type;

    if (type == "reel") {
        option = {
            resource_type: "video"
        }
    } else {
        option = {
            resource_type: "image"
        }
    }

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option);

    const newPost = await Post.create({
        caption,
        post: {
            id: myCloud.public_id,
            secure_url: myCloud.secure_url,
            resource_type: myCloud.resource_type,
        },

        owner: loginUserId,
        type,

    });

    return res
        .status(201)
        .json(
            {
                messsage: "Post created successfully",
                newPost,
            }
        );

});

export const deletePost = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res
            .status(404)
            .json(
                {
                    messsage: "Post not found"
                }
            )
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(
                {
                    message: "You are not authorized to delete this post"
                }
            )
    }

    await cloudinary.v2.uploader.destroy(post.post.id);
    await post.deleteOne();

    return res
        .status(200)
        .json(
            {
                message: "Post deleted successfully"
            }
        );

});

export const getAllPosts = TryCatch(async (req, res) => {

    const posts = await Post.find({ type: "post" })
        .sort({ createdAt: -1 })
        .populate("owner", "-password");

    const reels = await Post.find({ type: "reel" })
        .sort({ createdAt: -1 })
        .populate("owner", "-password");

    return res
        .status(200)
        .json(
            {
                message: "Posts fetched successfully",
                posts,
                reels,
            }
        )

});

export const likeUnlikePost = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res
            .status(404)
            .json(
                {
                    message: "Post not found"
                }
            )
    };

    if (post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id);

        post.likes.splice(index, 1);

        await post.save();

        return res
            .status(200)
            .json(
                {
                    message: "Post unlike successfully"
                }
            )
    } else {
        post.likes.push(req.user._id);
        await post.save();

        return res
            .status(200)
            .json(
                {
                    message: "Post like successfully"
                }
            )
    }

});

export const commentonPost = TryCatch(async (req, res) => {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res
            .status(404)
            .json(
                {
                    message: "Post not found"
                }
            )
    };

    post.comments.push(
        {
            user: req.user._id,
            comment,
            name: req.user.name
        }
    );

    await post.save();

    return res
        .status(200)
        .json(
            {
                message: "Comment added successfully"
            }
        );

});

export const deleteComment = TryCatch(async (req, res) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        return res
            .status(404)
            .json(
                {
                    message: "Post not found"
                }
            )
    };

    const { commentId } = req.body;

    if (!commentId) {
        return res
            .status(400)
            .json(
                {
                    message: "Comment Id is required"
                }
            )
    };

    const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === commentId.toString()
    );

    if (commentIndex === -1) {
        return res
            .status(404)
            .json(
                {
                    message: "Comment not found"
                }
            )
    };

    const comment = post.comments[commentIndex];

    if (post.owner.toString() === req.user._id.toString() || comment.user._id.toString() === req.user._id.toString()) {
        post.comments.splice(commentIndex, 1);
        await post.save();

        return res
            .status(200)
            .json(
                {
                    message: "Comment deleted successfully"
                }
            );
    } else {
        return res
            .status(403)
            .json(
                {
                    message: "You are not authorized to delete this comment"
                }
            )
    };

});

export const editCaption = TryCatch( async (req , res) =>{
    const {caption} = req.body;

     const post = await Post.findById(req.params.id);

    if (!post) {
        return res
            .status(404)
            .json(
                {
                    message: "Post not found"
                }
            )
    };

    if(post.owner.toString() !== req.user._id.toString()){
        return res
        .status(403)
        .json(
            {
                message : "You are not authorized to edit this post caption"
            }
        )
    };

    post.caption = caption;

    await post.save();

    return res
    .status(200)
    .json(
        {
            messsage : "Caption updated successfully"
        }
    )

});

export const editPost = TryCatch(async (req , res) =>{
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res
            .status(404)
            .json(
                {
                    message: "Post not found"
                }
            )
    };

    if(post.owner.toString() !== req.user._id.toString()){
        return res
        .status(403)
        .json(
            {
                message : "You are not authorized to edit this post"
            }
        )
    };

    const file = req.file;

    if (!file) {
        return res
        .status(404)
        .json(
            {
                message : "No file uploaded"
            }
        )
    };

    // if (file) {
        const fileUrl = getDataUri(file);
    // };

    await cloudinary.v2.uploader.destroy(post.post.id);

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content); 

    post.post = {
        id : myCloud.public_id,
        secure_url : myCloud.secure_url,
        resource_type : myCloud.resource_type,
    };

    await post.save();

    return res
    .status(200)
    .json(
        {
            message : "Post updated successfully"
        }
    );
});