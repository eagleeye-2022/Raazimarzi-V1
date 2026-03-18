import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { testSMTP } from "./services/mail.service.js"; 
import { registerCronJobs, runNoticePeriodCheckNow } from "./cron/noticePeriod.cron.js";
import protect, { authorizeRoles } from "./middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from "./routes/authRoutes.js";
import mediatorRoutes from "./routes/mediatorRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import adminRoutes from "./routes/adminRoutes.js"; 
import otpRoutes from "./routes/otpRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import contactRoutes from "./routes/contact.routes.js";
import demoRoutes from "./routes/demo.routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import arbitratorRoutes from "./routes/arbitratorRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";        
import caseManagerRoutes from "./routes/caseManagerRoutes.js";  

const app = express();

// ===== CORS Configuration =====
const allowedOrigins = [
  "https://raazimarzi.com",
  "https://www.raazimarzi.com",
  "http://localhost:3000",
  "http://localhost:3001"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===== Middleware =====
// ✅ Raw body for Razorpay webhook signature verification — must be BEFORE express.json()
// app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Static Files - Serve uploaded documents =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/mediator", mediatorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/demo", demoRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/arbitrator", arbitratorRoutes);
// app.use("/api/payments", paymentRoutes);         // ✅ NEW
app.use("/api/case-manager", caseManagerRoutes); // ✅ NEW

// ===== Admin: Manual Cron Trigger (for testing) =====
app.post(
  "/api/admin/cron/run-notice-check",
  protect,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      console.log("🔧 Manual cron trigger by admin:", req.user.email);
      await runNoticePeriodCheckNow();
      return res.status(200).json({
        success: true,
        message: "Notice period check completed. Check server logs for details.",
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ===== Health check =====
app.get("/", (req, res) => {
  res.json({ 
    message: "RaaziMarzi API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    uptime: process.uptime(),
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS) 
  });
});

// ===== Error handlers =====
app.use(notFound);
app.use(errorHandler);

// ===== MongoDB Connection =====
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are no longer needed in Mongoose 6+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // ✅ Register cron jobs AFTER DB is connected
    registerCronJobs();

  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error(`❌ MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// ===== HTTP + Socket.IO Server =====
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`👤 User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    console.log(`📨 Message in room ${roomId}:`, message);
    io.to(roomId).emit("receiveMessage", message);
  });

  // ✅ Typing indicator
  socket.on("typing", ({ roomId, userId, isTyping }) => {
    socket.to(roomId).emit("userTyping", { userId, isTyping });
  });

  socket.on("disconnect", (reason) => {
    console.log(`🔴 User disconnected: ${socket.id} - Reason: ${reason}`);
  });

  socket.on("error", (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Server + Socket.IO: http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  
  // ✅ Email Configuration Check
  console.log(`\n📧 Email Configuration:`);
  console.log(`   Host: ${process.env.EMAIL_HOST || 'smtp.zoho.in'}`);
  console.log(`   Port: ${process.env.EMAIL_PORT || '465'}`);
  console.log(`   User: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
  console.log(`   Pass: ${process.env.EMAIL_PASS ? '✅ Set (***' + process.env.EMAIL_PASS.slice(-4) + ')' : '❌ NOT SET'}`);
  console.log(`   From: ${process.env.EMAIL_FROM_NAME || 'RaaziMarzi'}`);
  
  // ✅ Test SMTP Connection
  console.log(`\n🔍 Testing SMTP connection...`);
  const smtpReady = await testSMTP();
  
  if (smtpReady) {
    console.log(`✅ Email service is ready!`);
  } else {
    console.error(`⚠️  WARNING: Email service is NOT working!`);
    console.error(`   - Check your .env file`);
    console.error(`   - Verify EMAIL_USER and EMAIL_PASS are correct`);
    console.error(`   - Ensure you're using Zoho App Password (not regular password)`);
  }
  
  console.log(`\n📝 Available Routes:`);
  console.log(`   POST /api/auth/signup - User registration`);
  console.log(`   POST /api/auth/login - User login`);
  console.log(`   GET  /api/auth/me - Get current user`);
  console.log(`   POST /api/otp/send-otp - Send OTP`);
  console.log(`   POST /api/otp/verify-otp - Verify OTP`);
  console.log(`   POST /api/password/reset - Reset password`);
  console.log(`   POST /api/documents/upload - Upload document`);
  console.log(`   GET  /api/documents/case/:caseId - Get case documents`);
  console.log(`   GET  /api/payments/fee/:caseType - Get filing fee`);
  console.log(`   POST /api/payments/create-order - Create Razorpay order`);
  console.log(`   POST /api/payments/verify - Verify payment`);
  console.log(`   POST /api/admin/cron/run-notice-check - Manual cron trigger`);
  console.log(`\n✨ Ready to accept connections!\n`);
});

// ===== Graceful Shutdown =====
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;