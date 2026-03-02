import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../api/axios";
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/Navbar";
import {
  FaPaperPlane,
  FaPaperclip,
  FaSearch,
  FaTimes,
  FaFileAlt,
  FaImage,
  FaEllipsisV,
  FaCheck,
  FaCheckDouble,
  FaCommentDots,
} from "react-icons/fa";
import "./UserChats.css";

const UserChats = () => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ═══════════ SOCKET.IO CONNECTION ═══════════
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const newSocket = io(apiUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to chat server");
    });

    newSocket.on("new-message", ({ message: newMessage }) => {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    });

    newSocket.on("user-typing", ({ userId, isTyping: typing }) => {
      if (typing) {
        setOtherUserTyping(true);
      } else {
        setOtherUserTyping(false);
      }
    });

    newSocket.on("messages-read", () => {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          status: msg.sender._id === localStorage.getItem("userId") ? "read" : msg.status,
        }))
      );
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // ═══════════ FETCH CONVERSATIONS & ADMIN ═══════════
  useEffect(() => {
    fetchConversations();
    fetchAdminUser();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/chats/conversations");
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error("❌ Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW - Fetch admin user to enable "Start Chat"
  const fetchAdminUser = async () => {
    try {
      // Get admin user (you can hardcode admin ID or fetch from settings)
      const res = await api.get("/admin/info"); // Create this endpoint if needed
      setAdminUser(res.data.admin);
    } catch (error) {
      console.error("❌ Failed to fetch admin:", error);
      // Fallback: Use hardcoded admin ID if endpoint doesn't exist
      // You'll need to replace this with your actual admin user ID
      setAdminUser({ _id: "ADMIN_USER_ID_HERE", name: "Support Team" });
    }
  };

  // ✅ NEW - Start conversation with admin
  const handleStartChat = async () => {
    if (!adminUser) {
      alert("Cannot find admin user. Please contact support.");
      return;
    }

    try {
      setLoading(true);
      
      // Send initial message to create conversation
      const res = await api.post("/chats/messages", {
        receiverId: adminUser._id,
        content: "Hello, I need help with my case.",
      });

      // Refresh conversations
      await fetchConversations();
      
      // Select the new conversation
      if (res.data.conversation) {
        setSelectedConversation(res.data.conversation);
        await fetchMessages(res.data.conversation._id);
      }
    } catch (error) {
      console.error("❌ Failed to start chat:", error);
      alert("Failed to start chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════ FETCH MESSAGES ═══════════
  const fetchMessages = async (conversationId) => {
    try {
      const res = await api.get(`/chats/conversations/${conversationId}/messages`);
      setMessages(res.data.messages || []);
      
      if (socket) {
        socket.emit("join-conversation", conversationId);
      }

      await api.patch(`/chats/conversations/${conversationId}/read`);
      scrollToBottom();
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
    }
  };

  // ═══════════ SELECT CONVERSATION ═══════════
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation._id);
  };

  // ═══════════ SEND MESSAGE ═══════════
  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return;

    const formData = new FormData();
    
    const receiverId = selectedConversation.participants.find(
      (p) => p.role === "admin" || p._id !== localStorage.getItem("userId")
    )?._id;

    formData.append("receiverId", receiverId);
    formData.append("content", message.trim() || "File attachment");
    
    if (selectedFile) {
      formData.append("file", selectedFile);
      formData.append("messageType", selectedFile.type.startsWith("image/") ? "image" : "file");
    }

    try {
      const res = await api.post("/chats/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) => [...prev, res.data.message]);
      setMessage("");
      setSelectedFile(null);
      scrollToBottom();
      handleStopTyping();
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  // ═══════════ TYPING INDICATOR ═══════════
  const handleTyping = () => {
    if (!socket || !selectedConversation) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId: selectedConversation._id,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000);
  };

  const handleStopTyping = () => {
    if (socket && selectedConversation && isTyping) {
      socket.emit("typing", {
        conversationId: selectedConversation._id,
        isTyping: false,
      });
      setIsTyping(false);
    }
  };

  // ═══════════ FILE UPLOAD ═══════════
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      alert("File size must be less than 5MB");
    }
  };

  // ═══════════ SCROLL TO BOTTOM ═══════════
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ═══════════ FORMAT TIME ═══════════
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ═══════════ RENDER MESSAGE STATUS ═══════════
  const renderMessageStatus = (msg) => {
    if (msg.sender._id !== localStorage.getItem("userId")) return null;

    if (msg.status === "read") {
      return <FaCheckDouble className="message-status read" />;
    }
    if (msg.status === "delivered") {
      return <FaCheckDouble className="message-status delivered" />;
    }
    return <FaCheck className="message-status sent" />;
  };

  // ═══════════ SEARCH CONVERSATIONS ═══════════
  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.participants.find(
      (p) => p._id !== localStorage.getItem("userId")
    );
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="dashboard-container">
        <UserSidebar activePage="chats" />
        <section className="main-section">
          <UserNavbar />
          <div style={{ padding: 20 }}>Loading chats...</div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <UserSidebar activePage="chats" />

      <section className="main-section">
        <UserNavbar />

        <div className="chat-container-pro">
          {/* ═══════════ LEFT SIDEBAR - CONVERSATIONS ═══════════ */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <h3>Messages</h3>
            </div>

            <div className="chat-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="conversations-list">
              {filteredConversations.length === 0 && (
                <div className="no-conversations">
                  <FaCommentDots className="no-conv-icon" />
                  <p>No conversations yet</p>
                  <small>Start chatting with support</small>
                  <button className="start-chat-btn" onClick={handleStartChat}>
                    <FaCommentDots />
                    Start Chat with Support
                  </button>
                </div>
              )}

              {filteredConversations.map((conv) => {
                const otherUser = conv.participants.find(
                  (p) => p._id !== localStorage.getItem("userId")
                );
                const isActive = selectedConversation?._id === conv._id;

                return (
                  <div
                    key={conv._id}
                    className={`conversation-item ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <div className="conversation-avatar">
                      <img
                        src={
                          otherUser?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            otherUser?.name || "User"
                          )}&background=4F46E5&color=fff`
                        }
                        alt={otherUser?.name}
                      />
                      {conv.unreadCount > 0 && (
                        <span className="unread-badge">{conv.unreadCount}</span>
                      )}
                    </div>

                    <div className="conversation-info">
                      <div className="conversation-header">
                        <h4>{otherUser?.name || "Unknown"}</h4>
                        <span className="conversation-time">
                          {conv.lastMessage?.sentAt &&
                            formatTime(conv.lastMessage.sentAt)}
                        </span>
                      </div>
                      <p className="conversation-preview">
                        {conv.lastMessage?.text || "No messages yet"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══════════ RIGHT SIDE - CHAT BOX ═══════════ */}
          {selectedConversation ? (
            <div className="chat-main">
              {/* HEADER */}
              <div className="chat-main-header">
                <div className="chat-header-left">
                  <img
                    src={
                      selectedConversation.participants.find(
                        (p) => p._id !== localStorage.getItem("userId")
                      )?.avatar ||
                      `https://ui-avatars.com/api/?name=Support&background=4F46E5&color=fff`
                    }
                    alt="User"
                  />
                  <div>
                    <h3>
                      {selectedConversation.participants.find(
                        (p) => p._id !== localStorage.getItem("userId")
                      )?.name || "Support"}
                    </h3>
                    {otherUserTyping && (
                      <span className="typing-indicator">typing...</span>
                    )}
                  </div>
                </div>
                <button className="chat-options-btn">
                  <FaEllipsisV />
                </button>
              </div>

              {/* MESSAGES */}
              <div className="chat-messages-pro">
                {messages.map((msg) => {
                  const isMine = msg.sender._id === localStorage.getItem("userId");

                  return (
                    <div
                      key={msg._id}
                      className={`message-bubble ${isMine ? "mine" : "theirs"}`}
                    >
                      {!isMine && (
                        <img
                          src={
                            msg.sender.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              msg.sender.name
                            )}&background=4F46E5&color=fff&size=32`
                          }
                          alt={msg.sender.name}
                          className="message-avatar"
                        />
                      )}

                      <div className="message-content">
                        {msg.attachment && (
                          <div className="message-attachment">
                            {msg.messageType === "image" ? (
                              <img
                                src={`${process.env.REACT_APP_API_URL}${msg.attachment.fileUrl}`}
                                alt="attachment"
                                className="message-image"
                              />
                            ) : (
                              <a
                                href={`${process.env.REACT_APP_API_URL}${msg.attachment.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="message-file-link"
                              >
                                <FaFileAlt />
                                <span>{msg.attachment.fileName}</span>
                              </a>
                            )}
                          </div>
                        )}

                        {msg.content && <p>{msg.content}</p>}

                        <div className="message-meta">
                          <span className="message-time">
                            {formatTime(msg.createdAt)}
                          </span>
                          {isMine && renderMessageStatus(msg)}
                          {msg.isEdited && <span className="edited-badge">edited</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div className="chat-input-pro">
                {selectedFile && (
                  <div className="file-preview">
                    <div className="file-preview-content">
                      {selectedFile.type.startsWith("image/") ? (
                        <FaImage />
                      ) : (
                        <FaFileAlt />
                      )}
                      <span>{selectedFile.name}</span>
                    </div>
                    <button onClick={() => setSelectedFile(null)}>
                      <FaTimes />
                    </button>
                  </div>
                )}

                <div className="chat-input-wrapper">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />

                  <button
                    className="attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaPaperclip />
                  </button>

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="message-input"
                  />

                  <button
                    className="send-btn"
                    onClick={handleSend}
                    disabled={!message.trim() && !selectedFile}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="chat-empty-state">
              <div className="empty-state-content">
                <FaCommentDots className="empty-icon" />
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the left to start chatting</p>
                {conversations.length === 0 && (
                  <button className="start-chat-btn-empty" onClick={handleStartChat}>
                    <FaCommentDots />
                    Start Chat with Support
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserChats;