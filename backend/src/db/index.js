import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`/n MongooseDB Connected !! DB Host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongoose Connection Failed", error);
    }
};
