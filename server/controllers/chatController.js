// controllers/chatController.js
import ChatMessage from "../models/ChatMessage.js";
import mongoose from "mongoose";

// GET /api/chat/:incidentId/:receiverId
export const getChatMessages = async (req, res) => {
  try {
    const { incidentId, receiverId } = req.params;
    const senderId = req.user.id;

    if (
      !mongoose.Types.ObjectId.isValid(incidentId) ||
      !mongoose.Types.ObjectId.isValid(receiverId) ||
      !mongoose.Types.ObjectId.isValid(senderId)
    ) {
      return res.status(400).json({ message: "Invalid IDs provided" });
    }

    const roomId = `${incidentId}_${[senderId, receiverId].sort().join("_")}`;

    const messages = await ChatMessage.find({ roomId })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar");

    res.status(200).json({ messages });
  } catch (err) {
    console.error("❌ Error fetching chat messages:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/chat/my-chats
export const getMyChats = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID provided" });
        }

        const chats = await ChatMessage.find({ receiver: userId })
            .populate("sender", "name avatar")
            .populate("incidentId", "type")
            .sort({ updatedAt: -1 });

        const uniqueChats = {};
        chats.forEach(chat => {
            const key = `${chat.incidentId._id}_${chat.sender._id}`;
            if (!uniqueChats[key]) {
                uniqueChats[key] = {
                    incidentId: chat.incidentId,
                    sender: chat.sender,
                    lastMessage: chat.text,
                    updatedAt: chat.updatedAt
                };
            }
        });

        res.json(Object.values(uniqueChats));
    } catch (err) {
        console.error("❌ Error in getMyChats:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/chat/:incidentId/:otherUserId
export const deleteChat = async (req, res) => {
    try {
        const { incidentId, otherUserId } = req.params;
        const userId = req.user.id;

        if (
            !mongoose.Types.ObjectId.isValid(incidentId) ||
            !mongoose.Types.ObjectId.isValid(otherUserId) ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return res.status(400).json({ message: "Invalid IDs provided" });
        }

        const roomId = `${incidentId}_${[userId, otherUserId].sort().join("_")}`;

        const result = await ChatMessage.deleteMany({ roomId });

        res.status(200).json({ message: "Chat deleted for both users", deletedCount: result.deletedCount });
    } catch (err) {
        console.error("❌ Error deleting chat:", err.message);
        res.status(500).json({ message: "Server error while deleting chat" });
    }
};
