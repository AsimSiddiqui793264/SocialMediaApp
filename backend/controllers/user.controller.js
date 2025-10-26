import { User } from "../models/user.models.js";
import TryCatch from "../utils/trycatch.js";
import getDataUri from "../utils/urlgenerator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";


export const myProfie = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        return res
            .status(404)
            .json(
                {
                    message: "User not found"
                }
            )
    };

    res.json(user);
});

export const followAndUnfollowUser = TryCatch(async (req, res) => {
    const userTofollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!userTofollow) {
        return res
            .status(404)
            .json(
                {
                    message: "User not found"
                }
            )
    };

    if (userTofollow._id.toString() == loggedInUser._id.toString()) {
        return res
            .status(400)
            .json(
                {
                    message: "You cannot follow yourself"
                }
            )
    };

    if (userTofollow.followers.includes(loggedInUser._id)) {

        const indexFollowing = loggedInUser.following.indexOf(userTofollow._id);
        const indexFollowers = userTofollow.followers.indexOf(loggedInUser._id);

        loggedInUser.following.splice(indexFollowing, 1);
        userTofollow.followers.splice(indexFollowers, 1);

        await loggedInUser.save();
        await userTofollow.save();

        return res
            .status(200)
            .json(
                {
                    message: "User Unfollowed successfully"
                }
            )
    } else {
        loggedInUser.following.push(userTofollow._id);
        userTofollow.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await userTofollow.save();

        return res
            .status(200)
            .json(
                {
                    message: "User followed successfully"
                }
            )

    }

});

export const userFollowersAndFollowingData = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select("-password")
        .populate("followers", "-paaword")
        .populate("following", "-password");

    const followers = user.followers;
    const following = user.following;

    if (!user) {
        return res
            .status(404)
            .json(
                {
                    message: "User not found"
                }
            )
    }

    return res
        .json(
            {
                message: "User data fetched successfully",
                followers,
                following,
            }
        )

});

export const updateProfile = TryCatch(async (req, res) => {

    const user = await User.findById(req.user._id);

    const { name } = req.body;
    
        if (!name) {
            return res
            .status(400)
            .json(
                {
                    message : "name is requied"
                }
            )
        };
    
        if (name) {
            user.name = name;
        };
    
    const file = req.file;


        if (!file) {
            return res
            .status(400)
            .json(
                {
                    message : "file is requied"
                }
            )
        };


    if (file) {
        const fileUrl = getDataUri(file);

        await cloudinary.v2.uploader.destroy(user.profilePic.id);

        const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);

        user.profilePic = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    };

    await user.save();

    return res.json(
        {
            message: "Profile updated successfully",
            user
        }
    )

});

export const updatePassword = TryCatch(async (req, res) => {

    const user = await User.findById(req.user._id);

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res
            .status(400)
            .json(
                {
                    message: "Please provide old and new password"
                }
            )
    };

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
        return res
            .status(400)
            .json(
                {
                    message: "Old password is incorrect"
                }
            )
    };

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res
        .status(200)
        .json(
            {
                message: "Password updated successfully"
            }
        )

})
