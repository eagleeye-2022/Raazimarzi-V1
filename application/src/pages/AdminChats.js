import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../api/axios";
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
  FaCog,
  FaBell,
} from "react-icons/fa";
import HomeIcon from "../assets/icons/home.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon from "../assets/icons/newcase.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";
import "./AdminChats.css";

const AdminChats = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ═══════════ SOCKET.IO CONNECTION ═══════════
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Admin connected to chat server");
    });

    newSocket.on("new-message", ({ message: newMessage, conversationId }) => {
      // Add message to current conversation if it's selected
      if (selectedConversation?._id === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();
      }

      // Update conversation list
      fetchConversations();
    });

    newSocket.on("user-typing", ({ userId, userName, isTyping: typing }) => {
      if (typing) {
        setTypingUsers((prev) => new Set(prev).add(userId));
      } else {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    });

    newSocket.on("user-online", ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    newSocket.on("user-offline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    newSocket.on("online-users", (users) => {
      setOnlineUsers(new Set(users));
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [selectedConversation]);

  // ═══════════ FETCH CONVERSATIONS ═══════════
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/chats/admin/conversations");
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error("❌ Failed to fetch conversations:", error);
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
    if (selectedConversation && socket) {
      socket.emit("leave-conversation", selectedConversation._id);
    }
    setSelectedConversation(conversation);
    await fetchMessages(conversation._id);
  };

  // ═══════════ SEND MESSAGE ═══════════
  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return;

    const formData = new FormData();
    
    const receiverId = selectedConversation.participants.find(
      (p) => p.role !== "admin"
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
    const myId = localStorage.getItem("userId");
    if (msg.sender._id !== myId) return null;

    if (msg.status === "read") {
      return <FaCheckDouble className="message-status read" />;
    }
    if (msg.status === "delivered") {
      return <FaCheckDouble className="message-status delivered" />;
    }
    return <FaCheck className="message-status sent" />;
  };

  // ═══════════ CHECK IF USER IS ONLINE ═══════════
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  // ═══════════ GET TOTAL UNREAD COUNT ═══════════
  const getTotalUnread = () => {
    return conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  };

  // ═══════════ SEARCH CONVERSATIONS ═══════════
  const filteredConversations = conversations.filter((conv) => {
    const user = conv.participants.find((p) => p.role !== "admin");
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2 className="sidebar-title">Dashboard</h2>
        </aside>
        <section className="main-section">
          <div style={{ padding: 20 }}>Loading chats...</div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="menu">
          <div className="menu-item" onClick={() => navigate("/admin/dashboard")}>
            <img src={HomeIcon} alt="Home" />
            <span>Home</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/new-cases")}>
            <img src={CaseIcon} alt="Cases" />
            <span>New Cases</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/case-meetings")}>
            <img src={MeetingIcon} alt="Meetings" />
            <span>Case Meetings</span>
          </div>
          <div className="menu-item active" onClick={() => navigate("/admin/chats")}>
            <img src={ChatIcon} alt="Chats" />
            <span>Chats</span>
            {getTotalUnread() > 0 && (
              <span className="sidebar-badge">{getTotalUnread()}</span>
            )}
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/payment")}>
            <img src={PaymentIcon} alt="Payment" />
            <span>Payment</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/support")}>
            <img src={SupportIcon} alt="Support" />
            <span>Support</span>
          </div>
        </nav>
        <div className="logout">
          <div className="menu-item">
            <img src={LogoutIcon} alt="Logout" />
            <span>Log out</span>
          </div>
        </div>
      </aside>

      {/* ═══════════ MAIN SECTION ═══════════ */}
      <section className="main-section">
        {/* NAVBAR */}
        <header className="navbar">
          <div></div>
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img src="https://i.pravatar.cc/40" alt="profile" className="profile-img" />
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* ═══════════ CHAT CONTAINER ═══════════ */}
        <div className="chat-container-pro">
          {/* LEFT SIDEBAR - CONVERSATIONS */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <h3>User Messages</h3>
              <span className="total-convos">{conversations.length}</span>
            </div>

            <div className="chat-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="conversations-list">
              {filteredConversations.length === 0 && (
                <div className="no-conversations">
                  <p>No user conversations</p>
                </div>
              )}

              {filteredConversations.map((conv) => {
                const user = conv.participants.find((p) => p.role !== "admin");
                const isActive = selectedConversation?._id === conv._id;
                const isOnline = isUserOnline(user?._id);

                return (
                  <div
                    key={conv._id}
                    className={`conversation-item ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <div className="conversation-avatar">
                      <img
                        src={
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.name || "User"
                          )}&background=4F46E5&color=fff`
                        }
                        alt={user?.name}
                      />
                      {isOnline && <span className="online-dot"></span>}
                      {conv.unreadCount > 0 && (
                        <span className="unread-badge">{conv.unreadCount}</span>
                      )}
                    </div>

                    <div className="conversation-info">
                      <div className="conversation-header">
                        <h4>{user?.name || "Unknown User"}</h4>
                        <span className="conversation-time">
                          {conv.lastMessage?.sentAt && formatTime(conv.lastMessage.sentAt)}
                        </span>
                      </div>
                      <p className="conversation-preview">
                        {conv.lastMessage?.text || "No messages yet"}
                      </p>
                      {conv.relatedCase && (
                        <span className="case-badge">
                          Case: {conv.relatedCase.caseId}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE - CHAT BOX */}
          {selectedConversation ? (
            <div className="chat-main">
              {/* HEADER */}
              <div className="chat-main-header">
                <div className="chat-header-left">
                  {(() => {
                    const user = selectedConversation.participants.find(
                      (p) => p.role !== "admin"
                    );
                    const isOnline = isUserOnline(user?._id);
                    return (
                      <>
                        <div className="header-avatar-wrapper">
                          <img
                            src={
                              user?.avatar ||
                              `https://ui-avatars.com/api/?name=${user?.name}&background=4F46E5&color=fff`
                            }
                            alt="User"
                          />
                          {isOnline && <span className="online-indicator"></span>}
                        </div>
                        <div>
                          <h3>{user?.name || "Unknown User"}</h3>
                          {typingUsers.size > 0 ? (
                            <span className="typing-indicator">typing...</span>
                          ) : (
                            <span className="user-status">
                              {isOnline ? "Online" : "Offline"}
                            </span>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
                <button className="chat-options-btn">
                  <FaEllipsisV />
                </button>
              </div>

              {/* MESSAGES */}
              <div className="chat-messages-pro">
                {messages.map((msg) => {
                  const isMine = msg.sender.role === "admin";

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
                          <span className="message-time">{formatTime(msg.createdAt)}</span>
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
                      {selectedFile.type.startsWith("image/") ? <FaImage /> : <FaFileAlt />}
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
                <h3>Select a user conversation</h3>
                <p>Choose a user from the left to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminChats;