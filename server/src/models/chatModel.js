import mongoose from "mongoose";

// ═══════════════════════════════════════════════════════════════
// CONVERSATION MODEL - Groups all messages between participants
// ═══════════════════════════════════════════════════════════════
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Related case (if chat is about a specific case)
    relatedCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },

    // Conversation type
    type: {
      type: String,
      enum: ["user-admin", "user-mediator", "case-participants", "group"],
      default: "user-admin",
    },

    // Last message info (for quick display in chat list)
    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      sentAt: Date,
    },

    // Unread count for each participant
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },

    // Conversation settings
    isArchived: {
      type: Boolean,
      default: false,
    },

    isMuted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast lookups
conversationSchema.index({ participants: 1 });
conversationSchema.index({ "lastMessage.sentAt": -1 });

// ═══════════════════════════════════════════════════════════════
// MESSAGE MODEL - Individual messages
// ═══════════════════════════════════════════════════════════════
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Message type
    messageType: {
      type: String,
      enum: ["text", "file", "image", "system"],
      default: "text",
    },

    // Message content
    content: {
      type: String,
      required: true,
    },

    // File attachment (if messageType is file/image)
    attachment: {
      fileName: String,
      fileUrl: String,
      fileSize: Number,
      mimeType: String,
    },

    // Message status
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read", "failed"],
      default: "sent",
    },

    // Read receipts - track who read the message and when
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Delivered receipts
    deliveredTo: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Reply to another message
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    // Message edited
    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: Date,

    // Message deleted (soft delete)
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,

    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Indexes for performance
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

// ═══════════════════════════════════════════════════════════════
// TYPING INDICATOR MODEL - Track who is typing
// ═══════════════════════════════════════════════════════════════
const typingIndicatorSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isTyping: {
    type: Boolean,
    default: false,
  },
  lastTypingTime: {
    type: Date,
    default: Date.now,
  },
});

// TTL index - auto-delete typing indicators after 10 seconds
typingIndicatorSchema.index(
  { lastTypingTime: 1 },
  { expireAfterSeconds: 10 }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
export const Message = mongoose.model("Message", messageSchema);
export const TypingIndicator = mongoose.model("TypingIndicator", typingIndicatorSchema);

export default { Conversation, Message, TypingIndicator };