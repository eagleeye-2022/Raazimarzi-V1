import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Store online users: { userId: socketId }
const onlineUsers = new Map();

export const initializeSocket = (server, allowedOrigins) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ═══════════ AUTHENTICATION MIDDLEWARE ═══════════
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      socket.userName = user.name;

      next();
    } catch (error) {
      console.error("Socket auth error:", error);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // ═══════════ CONNECTION HANDLER ═══════════
  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.userName} (${socket.userId})`);

    // ✅ Store user as online
    onlineUsers.set(socket.userId, socket.id);
    socket.join(socket.userId); // Join room with userId for direct messages

    // ✅ Broadcast online status
    io.emit("user-online", {
      userId: socket.userId,
      userName: socket.userName,
    });

    // ✅ Send current online users to newly connected user
    socket.emit("online-users", Array.from(onlineUsers.keys()));

    // ═══════════ JOIN CONVERSATION ROOM ═══════════
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`👤 User ${socket.userId} joined conversation: ${conversationId}`);
    });

    // ═══════════ LEAVE CONVERSATION ROOM ═══════════
    socket.on("leave-conversation", (conversationId) => {
      socket.leave(conversationId);
      console.log(`👤 User ${socket.userId} left conversation: ${conversationId}`);
    });

    // ═══════════ TYPING INDICATOR ═══════════
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit("user-typing", {
        userId: socket.userId,
        userName: socket.userName,
        isTyping,
      });
    });

    // ═══════════ MESSAGE DELIVERED ═══════════
    socket.on("message-delivered", ({ messageId, conversationId }) => {
      socket.to(conversationId).emit("delivery-confirmation", {
        messageId,
        deliveredTo: socket.userId,
        deliveredAt: new Date(),
      });
    });

    // ═══════════ MESSAGE READ ═══════════
    socket.on("message-read", ({ messageId, conversationId }) => {
      socket.to(conversationId).emit("read-confirmation", {
        messageId,
        readBy: socket.userId,
        readAt: new Date(),
      });
    });

    // ═══════════ DISCONNECT ═══════════
    socket.on("disconnect", (reason) => {
      console.log(`🔴 User disconnected: ${socket.userName} - Reason: ${reason}`);
      
      // Remove user from online users
      onlineUsers.delete(socket.userId);

      // Broadcast offline status
      io.emit("user-offline", {
        userId: socket.userId,
      });
    });

    // ═══════════ ERROR HANDLER ═══════════
    socket.on("error", (error) => {
      console.error(`❌ Socket error for ${socket.userId}:`, error);
    });
  });

  // ═══════════ MAKE IO AVAILABLE IN ROUTES ═══════════
  return io;
};

// ═══════════ HELPER: Get Socket ID for User ═══════════
export const getSocketIdForUser = (userId) => {
  return onlineUsers.get(userId.toString());
};

// ═══════════ HELPER: Check if User is Online ═══════════
export const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString());
};

export default initializeSocket;