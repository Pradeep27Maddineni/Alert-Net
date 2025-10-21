import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { getChatMessages,getMyChats ,deleteChat  } from "../controllers/chatController.js";

const router = express.Router();

// GET chat history
router.get("/:incidentId/:receiverId", requireAuth, getChatMessages);
router.get("/my-chats", requireAuth, getMyChats);
router.delete("/:incidentId/:otherUserId", requireAuth, deleteChat);

export default router;
