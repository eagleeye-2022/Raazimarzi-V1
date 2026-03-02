import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/chatUpload.js";
import {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead,
  searchMessages,
  deleteMessage,
  editMessage,
  updateTypingStatus,
  getAdminConversations,
} from "../controllers/chatController.js";

const router = express.Router();

/* ═══════════════════════════════════════════════════════════════
   USER ROUTES
═══════════════════════════════════════════════════════════════ */

// Get all conversations for logged-in user
router.get("/conversations", protect, getConversations);

// Get messages in a specific conversation
router.get("/conversations/:conversationId/messages", protect, getMessages);

// Send message (with optional file upload)
router.post(
  "/messages",
  protect,
  upload.single("file"), // field name for file uploads
  sendMessage
);

// Mark messages as read in a conversation
router.patch("/conversations/:conversationId/read", protect, markAsRead);

// Search messages
router.get("/search", protect, searchMessages);

// Delete message
router.delete("/messages/:messageId", protect, deleteMessage);

// Edit message
router.patch("/messages/:messageId", protect, editMessage);

// Update typing status
router.post("/typing", protect, updateTypingStatus);

/* ═══════════════════════════════════════════════════════════════
   ADMIN ROUTES
═══════════════════════════════════════════════════════════════ */

// Get all conversations (admin view)
router.get(
  "/admin/conversations",
  protect,
  authorizeRoles(["admin"]),
  getAdminConversations
);

export default router;