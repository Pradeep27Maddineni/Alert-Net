// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import cloudinary from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/auth.js';
import incidentRoutes from './routes/incident.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import User from './models/User.js';
import ChatMessage from './models/ChatMessage.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes(io)); // Pass io to route factory
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use('/api/chat', chatRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 AlertNet API is running...');
});


// Socket.IO Setup with Validation
function iosetup(io) {
  io.on("connection", (socket) => {
    console.log("✅ User connected");

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
        console.log("❌ User disconnected");
    });
});
}

iosetup(io);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
