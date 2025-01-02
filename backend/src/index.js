import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { ConnectDB } from "./db/index.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log("server is running in port: "+ PORT);
    ConnectDB();
});