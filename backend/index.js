import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./database/db.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from "cookie-parser";


  cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_CLOUD_API_KEY, 
        api_secret: process.env.CLOUDINARY_CLOUD_SECRET 
    });



const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 4000;

app.get("/" , (req , res) =>{
    res.send("API is runing...")
})

app.use("/api/auth" , authRoutes);
app.use("/api/user" , userRoutes);
app.use("/api/post" , postRoutes);
app.use("/api/messages" , messageRoutes);

app.listen( port , () =>{
    console.log(`Server is runing on http://localhost:${port}`);
    connectDB();
})