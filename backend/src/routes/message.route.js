import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessage, getUsersForSidebar, sendMessage } from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/user", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, sendMessage)

export default router;