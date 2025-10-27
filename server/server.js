// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import cloudinary from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/auth.js";
import incidentRoutes from "./routes/incident.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Models
import ChatMessage from "./models/ChatMessage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Express & Server Setup
const app = express();
const server = http.createServer(app);

// ✅ Allowed Frontend Origins
const allowedOrigins = [
  "https://alertnet-frontend.vercel.app",
  "http://localhost:5173"
];

// ✅ Express CORS Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Socket.IO Server Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // fallback for Render
});

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("joinChatRoom", (roomId) => {
    socket.join(roomId);
    console.log(`✅ User joined chat room: ${roomId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { incidentId, senderId, receiverId, text } = data;

      if (!incidentId || !senderId || !receiverId || !text) {
        console.warn("⚠️ Incomplete message data:", data);
        return;
      }

      const roomId = `${incidentId}_${[senderId, receiverId].sort().join("_")}`;

      const message = await ChatMessage.create({
        incidentId,
        sender: senderId,
        receiver: receiverId,
        text,
        roomId,
      });

      io.to(roomId).emit("receiveMessage", {
        _id: message._id,
        incidentId,
        sender: senderId,
        receiver: receiverId,
        text,
        createdAt: message.createdAt,
      });

      console.log(`✉️ Message saved & emitted in room: ${roomId}`);
    } catch (err) {
      console.error("❌ Error saving message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes(io)); // pass io to routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api/chat", chatRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🚀 AlertNet API is running...");
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
