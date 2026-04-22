import React, { useState, useEffect, useRef, useCallback } from "react";
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
  FaTrash,
  FaPen,
  FaReply,
} from "react-icons/fa";

/* ─── inline styles ─────────────────────────────────────────── */
const S = {
  /* layout */
  dashboard: { display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#fff" },
  mainSection: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  chatWrap: { flex: 1, display: "flex", overflow: "hidden", margin: "12px 16px 16px", gap: 12 },

  /* sidebar */
  sidebar: { width: 300, minWidth: 260, background: "#16181f", borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #1e2130" },
  sidebarHead: { padding: "20px 20px 12px", borderBottom: "1px solid #1e2130" },
  sidebarTitle: { margin: 0, fontSize: 17, fontWeight: 700, color: "#e8eaf0", letterSpacing: "-0.3px" },
  searchWrap: { padding: "12px 14px", borderBottom: "1px solid #1e2130" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 10, padding: "8px 12px" },
  searchInput: { flex: 1, background: "none", border: "none", outline: "none", color: "#c8cad4", fontSize: 13, fontFamily: "inherit" },
  convList: { flex: 1, overflowY: "auto", padding: "6px 0" },
  convItem: (active) => ({
    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer",
    background: active ? "linear-gradient(90deg,#2a2d3e,#1e2130)" : "transparent",
    borderLeft: active ? "3px solid #6366f1" : "3px solid transparent",
    transition: "all .15s",
  }),
  convAvatar: { position: "relative", flexShrink: 0 },
  convAvatarImg: { width: 42, height: 42, borderRadius: "50%", objectFit: "cover" },
  unreadBadge: { position: "absolute", top: -2, right: -2, background: "#6366f1", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" },
  convInfo: { flex: 1, minWidth: 0 },
  convRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  convName: { fontSize: 13.5, fontWeight: 600, color: "#dde0ec", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  convTime: { fontSize: 11, color: "#5a5d72", flexShrink: 0 },
  convPreview: { fontSize: 12, color: "#6b6e84", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  emptyConv: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 24, gap: 8, color: "#5a5d72", textAlign: "center" },

  /* main chat area */
  chatMain: { flex: 1, background: "#16181f", borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #1e2130" },
  chatHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #1e2130", background: "#16181f" },
  chatHeaderLeft: { display: "flex", alignItems: "center", gap: 12 },
  chatHeaderAvatar: { width: 38, height: 38, borderRadius: "50%", objectFit: "cover" },
  chatHeaderName: { margin: 0, fontSize: 15, fontWeight: 700, color: "#e8eaf0" },
  typingLabel: { fontSize: 11, color: "#6366f1", margin: "2px 0 0", display: "block" },
  headerBtn: { background: "none", border: "none", color: "#6b6e84", cursor: "pointer", padding: 6, borderRadius: 8, fontSize: 15 },

  /* messages */
  msgArea: { flex: 1, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 4 },
  msgBubbleWrap: (mine) => ({ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8, marginBottom: 4 }),
  msgAvatarImg: { width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginBottom: 2 },
  bubble: (mine) => ({
    maxWidth: "62%", padding: "10px 14px", borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    background: mine ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "#1e2130",
    color: mine ? "#fff" : "#dde0ec", fontSize: 14, lineHeight: 1.5, wordBreak: "break-word",
    boxShadow: mine ? "0 4px 16px rgba(99,102,241,.3)" : "none",
    position: "relative",
  }),
  bubbleText: { margin: 0 },
  msgMeta: { display: "flex", alignItems: "center", gap: 5, marginTop: 4, justifyContent: "flex-end" },
  msgTime: { fontSize: 10.5, color: "rgba(255,255,255,.45)", lineHeight: 1 },
  msgTimeOther: { fontSize: 10.5, color: "#5a5d72", lineHeight: 1 },
  statusRead: { color: "#60a5fa", fontSize: 10 },
  statusDelivered: { color: "rgba(255,255,255,.5)", fontSize: 10 },
  statusSent: { color: "rgba(255,255,255,.35)", fontSize: 10 },
  editedBadge: { fontSize: 10, color: "rgba(255,255,255,.4)", fontStyle: "italic" },
  deletedBubble: { fontStyle: "italic", color: "rgba(255,255,255,.4)", fontSize: 13 },

  /* reply preview */
  replyPreview: { background: "rgba(0,0,0,.3)", borderLeft: "3px solid #6366f1", borderRadius: "8px 8px 0 0", padding: "8px 12px", marginBottom: -4, fontSize: 12, color: "#9ca3af" },

  /* attachment */
  attachMsg: { marginBottom: 6, display: "flex", flexDirection: "column", gap: 4 },
  attachImg: { maxWidth: 220, maxHeight: 180, borderRadius: 10, objectFit: "cover", cursor: "pointer" },
  attachFile: { display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,.25)", borderRadius: 8, padding: "8px 12px", textDecoration: "none", color: "inherit", fontSize: 13 },

  /* msg context menu */
  msgActions: (mine) => ({ position: "absolute", top: -32, [mine ? "right" : "left"]: 0, display: "flex", gap: 4, background: "#2a2d3e", borderRadius: 8, padding: "4px 6px", boxShadow: "0 4px 16px rgba(0,0,0,.4)", zIndex: 10 }),
  actionBtn: { background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 12, padding: "2px 5px", borderRadius: 4, display: "flex", alignItems: "center", gap: 3 },

  /* input */
  inputArea: { padding: "12px 16px 16px", borderTop: "1px solid #1e2130" },
  filePreview: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1e2130", borderRadius: 10, padding: "8px 12px", marginBottom: 8, fontSize: 13, color: "#9ca3af" },
  replyBar: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1e2130", borderRadius: 10, padding: "8px 12px", marginBottom: 8, fontSize: 12, color: "#9ca3af", borderLeft: "3px solid #6366f1" },
  editBar: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1e2130", borderRadius: 10, padding: "8px 12px", marginBottom: 8, fontSize: 12, color: "#fbbf24", borderLeft: "3px solid #fbbf24" },
  inputRow: { display: "flex", alignItems: "center", gap: 10, background: "#1e2130", borderRadius: 12, padding: "8px 10px" },
  textInput: { flex: 1, background: "none", border: "none", outline: "none", color: "#e8eaf0", fontSize: 14, fontFamily: "inherit", padding: "2px 4px" },
  iconBtn: (disabled) => ({ background: "none", border: "none", color: disabled ? "#3a3d4e" : "#6b6e84", cursor: disabled ? "not-allowed" : "pointer", padding: 6, borderRadius: 8, fontSize: 16, display: "flex", alignItems: "center", transition: "color .15s" }),
  sendBtn: (disabled) => ({
    background: disabled ? "#2a2d3e" : "linear-gradient(135deg,#6366f1,#4f46e5)",
    border: "none", borderRadius: 10, color: disabled ? "#3a3d4e" : "#fff", cursor: disabled ? "not-allowed" : "pointer",
    padding: "8px 14px", fontSize: 15, display: "flex", alignItems: "center", transition: "all .15s",
    boxShadow: disabled ? "none" : "0 4px 12px rgba(99,102,241,.35)",
  }),

  /* empty state */
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#5a5d72", background: "#16181f", borderRadius: 16, border: "1px solid #1e2130" },
  emptyIcon: { fontSize: 48, color: "#2a2d3e" },
  emptyTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: "#3a3d4e" },
  emptyText: { margin: 0, fontSize: 14 },
  startBtn: { marginTop: 8, background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(99,102,241,.35)" },

  /* loading */
  loading: { display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "#5a5d72", fontSize: 14 },
  dot: (i) => ({ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`, display: "inline-block", margin: "0 2px" }),

  /* date separator */
  dateSep: { display: "flex", alignItems: "center", gap: 10, margin: "12px 0" },
  dateLine: { flex: 1, height: 1, background: "#1e2130" },
  dateLabel: { fontSize: 11, color: "#5a5d72", fontWeight: 600, whiteSpace: "nowrap" },
};

/* ─── helpers ────────────────────────────────────────────────── */
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d) => {
  const now = new Date(); const day = new Date(d);
  if (now.toDateString() === day.toDateString()) return "Today";
  const yd = new Date(now); yd.setDate(yd.getDate() - 1);
  if (yd.toDateString() === day.toDateString()) return "Yesterday";
  return day.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const groupByDate = (msgs) => {
  const groups = []; let lastDate = null;
  msgs.forEach((m) => {
    const d = fmtDate(m.createdAt);
    if (d !== lastDate) { groups.push({ type: "date", label: d }); lastDate = d; }
    groups.push(m);
  });
  return groups;
};

/* ─── component ──────────────────────────────────────────────── */
const UserChats = () => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);

  const endRef = useRef(null);
  const fileRef = useRef(null);
  const typingRef = useRef(null);
  const inputRef = useRef(null);

  const userId = localStorage.getItem("userId");

  /* ── socket ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const url = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const s = io(url, { auth: { token }, transports: ["websocket", "polling"] });

    s.on("new-message", ({ message: m }) => {
      setMessages((p) => [...p, m]);
      scrollBottom();
      // mark read if conversation is open
      if (selected) {
        api.patch(`/chats/conversations/${m.conversationId}/read`).catch(() => {});
      }
    });

    s.on("user-typing", ({ isTyping: t }) => setOtherTyping(t));
    s.on("typing", ({ isTyping: t }) => setOtherTyping(t));

    s.on("messages-read", () => {
      setMessages((p) => p.map((m) => m.sender._id === userId ? { ...m, status: "read" } : m));
    });

    s.on("message-deleted", ({ messageId }) => {
      setMessages((p) => p.map((m) => m._id === messageId ? { ...m, isDeleted: true, content: "This message was deleted" } : m));
    });

    s.on("message-edited", ({ messageId, content, editedAt }) => {
      setMessages((p) => p.map((m) => m._id === messageId ? { ...m, content, isEdited: true, editedAt } : m));
    });

    setSocket(s);
    return () => s.close();
  }, []); // eslint-disable-line

  /* ── fetch init ── */
  useEffect(() => {
    fetchConversations();
    fetchAdmin();
  }, []);

  const fetchConversations = async () => {
    try {
      const r = await api.get("/chats/conversations");
      setConversations(r.data.conversations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmin = async () => {
    try {
      const r = await api.get("/admin/info");
      setAdminUser(r.data.admin);
    } catch {
      setAdminUser({ _id: "ADMIN_USER_ID_HERE", name: "Support Team" });
    }
  };

  /* ── fetch messages ── */
  const fetchMessages = useCallback(async (convId) => {
    try {
      const r = await api.get(`/chats/conversations/${convId}/messages`);
      setMessages(r.data.messages || []);
      if (socket) socket.emit("join-conversation", convId);
      await api.patch(`/chats/conversations/${convId}/read`);
      scrollBottom();
    } catch (e) {
      console.error(e);
    }
  }, [socket]);

  /* ── select conversation ── */
  const handleSelect = async (conv) => {
    setSelected(conv);
    setReplyTo(null);
    setEditingMsg(null);
    await fetchMessages(conv._id);
  };

  /* ── start chat with admin ── */
  const handleStartChat = async () => {
    if (!adminUser) return;
    try {
      setLoading(true);
      const r = await api.post("/chats/messages", {
        receiverId: adminUser._id,
        content: "Hello, I need help with my case.",
      });
      await fetchConversations();
      if (r.data.conversation) {
        setSelected(r.data.conversation);
        await fetchMessages(r.data.conversation._id);
      }
    } catch (e) {
      alert("Failed to start chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── send / edit message ── */
  const handleSend = async () => {
    if (!input.trim() && !file) return;
    if (sending) return;

    // edit mode
    if (editingMsg) {
      try {
        await api.patch(`/chats/messages/${editingMsg._id}`, { content: input.trim() });
        setMessages((p) => p.map((m) => m._id === editingMsg._id ? { ...m, content: input.trim(), isEdited: true } : m));
        setEditingMsg(null);
        setInput("");
      } catch { alert("Failed to edit message."); }
      return;
    }

    setSending(true);
    try {
      const receiverId = selected.participants.find(
        (p) => p._id !== userId
      )?._id;

      if (file) {
        const fd = new FormData();
        fd.append("receiverId", receiverId);
        fd.append("content", input.trim() || "File attachment");
        fd.append("file", file);
        fd.append("messageType", file.type.startsWith("image/") ? "image" : "file");
        if (replyTo) fd.append("replyToId", replyTo._id);
        const r = await api.post("/chats/messages", fd, { headers: { "Content-Type": "multipart/form-data" } });
        setMessages((p) => [...p, r.data.message]);
        setFile(null);
      } else {
        const r = await api.post("/chats/messages", {
          receiverId,
          content: input.trim(),
          replyToId: replyTo?._id,
        });
        setMessages((p) => [...p, r.data.message]);
      }

      setInput("");
      setReplyTo(null);
      handleStopTyping();
      scrollBottom();
      // refresh conversation list to update preview
      fetchConversations();
    } catch {
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  /* ── delete message ── */
  const handleDelete = async (msg, forAll) => {
    try {
      await api.delete(`/chats/messages/${msg._id}`, { data: { deleteFor: forAll ? "everyone" : "me" } });
      if (forAll) {
        setMessages((p) => p.map((m) => m._id === msg._id ? { ...m, isDeleted: true, content: "This message was deleted" } : m));
      } else {
        setMessages((p) => p.filter((m) => m._id !== msg._id));
      }
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete.");
    }
  };

  /* ── typing ── */
  const handleTyping = () => {
    if (!socket || !selected) return;
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { conversationId: selected._id, isTyping: true });
    }
    clearTimeout(typingRef.current);
    typingRef.current = setTimeout(handleStopTyping, 2000);
  };

  const handleStopTyping = () => {
    if (socket && selected && isTyping) {
      socket.emit("typing", { conversationId: selected._id, isTyping: false });
      setIsTyping(false);
    }
  };

  /* ── file ── */
  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert("Max file size is 5MB"); return; }
    setFile(f);
  };

  const scrollBottom = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

  /* ── filtered convs ── */
  const filtered = conversations.filter((c) => {
    const other = c.participants.find((p) => p._id !== userId);
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  /* ── render status icon ── */
  const StatusIcon = ({ msg }) => {
    if (msg.sender._id !== userId) return null;
    if (msg.status === "read") return <FaCheckDouble style={S.statusRead} />;
    if (msg.status === "delivered") return <FaCheckDouble style={S.statusDelivered} />;
    return <FaCheck style={S.statusSent} />;
  };

  /* ── bounce animation ── */
  const bounceKF = `@keyframes bounce { 0%,80%,100%{transform:scale(0);opacity:.4} 40%{transform:scale(1);opacity:1} }`;

  /* ══════════════════ RENDER ══════════════════ */
  if (loading) {
    return (
      <div style={S.dashboard}>
        <style>{bounceKF}</style>
        <UserSidebar activePage="chats" />
        <section style={S.mainSection}>
          <UserNavbar />
          <div style={{ ...S.loading, gap: 6 }}>
            {[0,1,2].map(i => <span key={i} style={S.dot(i)} />)}
          </div>
        </section>
      </div>
    );
  }

  const grouped = groupByDate(messages);
  const otherParticipant = selected?.participants.find((p) => p._id !== userId);

  return (
    <div style={S.dashboard}>
      <style>{`
        ${bounceKF}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2a2d3e;border-radius:4px}
        .conv-item:hover{background:#1a1c27!important}
        .action-btn:hover{color:#e8eaf0!important;background:#3a3d4e!important}
        .msg-bubble:hover .msg-actions{opacity:1!important}
        .msg-actions{opacity:0!important;transition:opacity .15s}
        .send-btn-hover:hover{filter:brightness(1.1);transform:scale(1.05)}
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <UserSidebar activePage="chats" />

      <section style={S.mainSection}>
        <UserNavbar />

        <div style={S.chatWrap}>
          {/* ── LEFT SIDEBAR ── */}
          <div style={S.sidebar}>
            <div style={S.sidebarHead}>
              <h3 style={S.sidebarTitle}>Messages</h3>
            </div>

            <div style={S.searchWrap}>
              <div style={S.searchBox}>
                <FaSearch style={{ color: "#5a5d72", fontSize: 12 }} />
                <input
                  style={S.searchInput}
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <FaTimes
                    style={{ color: "#5a5d72", fontSize: 11, cursor: "pointer" }}
                    onClick={() => setSearch("")}
                  />
                )}
              </div>
            </div>

            <div style={S.convList}>
              {filtered.length === 0 ? (
                <div style={S.emptyConv}>
                  <FaCommentDots style={{ fontSize: 32, color: "#2a2d3e" }} />
                  <p style={{ margin: 0, fontSize: 13 }}>No conversations yet</p>
                  <button style={S.startBtn} onClick={handleStartChat}>
                    <FaCommentDots /> Start Chat with Support
                  </button>
                </div>
              ) : (
                filtered.map((conv) => {
                  const other = conv.participants.find((p) => p._id !== userId);
                  const active = selected?._id === conv._id;
                  return (
                    <div
                      key={conv._id}
                      className="conv-item"
                      style={S.convItem(active)}
                      onClick={() => handleSelect(conv)}
                    >
                      <div style={S.convAvatar}>
                        <img
                          style={S.convAvatarImg}
                          src={other?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other?.name || "U")}&background=4f46e5&color=fff`}
                          alt={other?.name}
                        />
                        {conv.unreadCount > 0 && (
                          <span style={S.unreadBadge}>{conv.unreadCount}</span>
                        )}
                      </div>
                      <div style={S.convInfo}>
                        <div style={S.convRow}>
                          <h4 style={S.convName}>{other?.name || "Unknown"}</h4>
                          <span style={S.convTime}>{conv.lastMessage?.sentAt && fmtTime(conv.lastMessage.sentAt)}</span>
                        </div>
                        <p style={S.convPreview}>{conv.lastMessage?.text || "No messages yet"}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── CHAT MAIN ── */}
          {selected ? (
            <div style={S.chatMain}>
              {/* header */}
              <div style={S.chatHeader}>
                <div style={S.chatHeaderLeft}>
                  <img
                    style={S.chatHeaderAvatar}
                    src={otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant?.name || "Support")}&background=4f46e5&color=fff`}
                    alt="avatar"
                  />
                  <div>
                    <h3 style={S.chatHeaderName}>{otherParticipant?.name || "Support"}</h3>
                    {otherTyping && <span style={S.typingLabel}>typing...</span>}
                  </div>
                </div>
                <button style={S.headerBtn}><FaEllipsisV /></button>
              </div>

              {/* messages */}
              <div style={S.msgArea}>
                {grouped.map((item, idx) => {
                  if (item.type === "date") {
                    return (
                      <div key={`date-${idx}`} style={S.dateSep}>
                        <div style={S.dateLine} />
                        <span style={S.dateLabel}>{item.label}</span>
                        <div style={S.dateLine} />
                      </div>
                    );
                  }

                  const msg = item;
                  const mine = msg.sender._id === userId;

                  return (
                    <div
                      key={msg._id}
                      className="msg-bubble"
                      style={S.msgBubbleWrap(mine)}
                      onMouseEnter={() => setHoveredMsg(msg._id)}
                      onMouseLeave={() => setHoveredMsg(null)}
                    >
                      {!mine && (
                        <img
                          style={S.msgAvatarImg}
                          src={msg.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}&background=4f46e5&color=fff&size=32`}
                          alt={msg.sender.name}
                        />
                      )}

                      <div style={{ position: "relative" }}>
                        {/* context menu */}
                        {hoveredMsg === msg._id && !msg.isDeleted && (
                          <div className="msg-actions" style={S.msgActions(mine)}>
                            <button
                              className="action-btn"
                              style={S.actionBtn}
                              title="Reply"
                              onClick={() => { setReplyTo(msg); setEditingMsg(null); inputRef.current?.focus(); }}
                            >
                              <FaReply />
                            </button>
                            {mine && (
                              <>
                                <button
                                  className="action-btn"
                                  style={S.actionBtn}
                                  title="Edit"
                                  onClick={() => { setEditingMsg(msg); setInput(msg.content); setReplyTo(null); inputRef.current?.focus(); }}
                                >
                                  <FaPen />
                                </button>
                                <button
                                  className="action-btn"
                                  style={{ ...S.actionBtn, color: "#f87171" }}
                                  title="Delete"
                                  onClick={() => handleDelete(msg, true)}
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        <div style={S.bubble(mine)}>
                          {/* reply preview */}
                          {msg.replyTo && !msg.isDeleted && (
                            <div style={{ ...S.replyPreview, marginBottom: 8 }}>
                              <strong style={{ color: "#818cf8" }}>{msg.replyTo.sender?.name || "User"}</strong>
                              <p style={{ margin: "2px 0 0", opacity: .7 }}>{msg.replyTo.content?.slice(0, 80)}</p>
                            </div>
                          )}

                          {msg.isDeleted ? (
                            <p style={S.deletedBubble}>🚫 This message was deleted</p>
                          ) : (
                            <>
                              {/* attachment */}
                              {msg.attachment && (
                                <div style={S.attachMsg}>
                                  {msg.messageType === "image" ? (
                                    <img
                                      style={S.attachImg}
                                      src={`${process.env.REACT_APP_API_URL}${msg.attachment.fileUrl}`}
                                      alt="attachment"
                                      onClick={() => window.open(`${process.env.REACT_APP_API_URL}${msg.attachment.fileUrl}`, "_blank")}
                                    />
                                  ) : (
                                    <a
                                      style={S.attachFile}
                                      href={`${process.env.REACT_APP_API_URL}${msg.attachment.fileUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FaFileAlt style={{ flexShrink: 0 }} />
                                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.attachment.fileName}</span>
                                    </a>
                                  )}
                                </div>
                              )}

                              {msg.content && msg.content !== "File attachment" && (
                                <p style={S.bubbleText}>{msg.content}</p>
                              )}
                            </>
                          )}

                          <div style={S.msgMeta}>
                            <span style={mine ? S.msgTime : S.msgTimeOther}>{fmtTime(msg.createdAt)}</span>
                            {msg.isEdited && !msg.isDeleted && <span style={S.editedBadge}>edited</span>}
                            <StatusIcon msg={msg} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* input */}
              <div style={S.inputArea}>
                {/* reply bar */}
                {replyTo && (
                  <div style={S.replyBar}>
                    <div>
                      <strong style={{ color: "#818cf8" }}>Replying to {replyTo.sender?.name}</strong>
                      <p style={{ margin: "2px 0 0" }}>{replyTo.content?.slice(0, 80)}</p>
                    </div>
                    <button style={{ background: "none", border: "none", color: "#6b6e84", cursor: "pointer" }} onClick={() => setReplyTo(null)}>
                      <FaTimes />
                    </button>
                  </div>
                )}

                {/* edit bar */}
                {editingMsg && (
                  <div style={S.editBar}>
                    <div><strong>Editing message</strong><p style={{ margin: "2px 0 0" }}>{editingMsg.content?.slice(0, 80)}</p></div>
                    <button style={{ background: "none", border: "none", color: "#6b6e84", cursor: "pointer" }} onClick={() => { setEditingMsg(null); setInput(""); }}>
                      <FaTimes />
                    </button>
                  </div>
                )}

                {/* file preview */}
                {file && (
                  <div style={S.filePreview}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {file.type.startsWith("image/") ? <FaImage /> : <FaFileAlt />}
                      <span style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                      <span style={{ fontSize: 11, color: "#3a3d4e" }}>({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button style={{ background: "none", border: "none", color: "#6b6e84", cursor: "pointer" }} onClick={() => setFile(null)}>
                      <FaTimes />
                    </button>
                  </div>
                )}

                <input type="file" ref={fileRef} onChange={handleFileSelect} style={{ display: "none" }} accept="image/*,.pdf,.doc,.docx,.txt" />

                <div style={S.inputRow}>
                  <button style={S.iconBtn(false)} onClick={() => fileRef.current?.click()} title="Attach file">
                    <FaPaperclip />
                  </button>

                  <input
                    ref={inputRef}
                    style={S.textInput}
                    value={input}
                    onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={editingMsg ? "Edit your message..." : "Type a message..."}
                  />

                  <button
                    className="send-btn-hover"
                    style={S.sendBtn(!input.trim() && !file)}
                    onClick={handleSend}
                    disabled={(!input.trim() && !file) || sending}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* empty state */
            <div style={S.emptyState}>
              <FaCommentDots style={S.emptyIcon} />
              <h3 style={S.emptyTitle}>No conversation selected</h3>
              <p style={S.emptyText}>Pick a chat from the left or start a new one</p>
              {conversations.length === 0 && (
                <button style={S.startBtn} onClick={handleStartChat}>
                  <FaCommentDots /> Start Chat with Support
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserChats;