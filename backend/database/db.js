import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


export const connectDB = async () =>{
    try {
        const connectedInstance = await mongoose.connect(process.env.MONGO_URL , {
            dbName : "socialMediaApp"
        });
        console.log(`DB connected !! DB host : ${connectedInstance.connection.host}` );
    } catch (error) {
        console.log("DB connected error is : " , error);
    }
}