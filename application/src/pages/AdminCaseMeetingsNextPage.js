import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import HomeIcon    from "../assets/icons/home.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon    from "../assets/icons/newcase.png";
import ChatIcon    from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon  from "../assets/icons/logout.png";
import "../pages/AdminCaseMeetingsNextPage.css";
import { FaCog, FaBell, FaVideo, FaPhoneSlash, FaMicrophone, FaDesktop } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CaseMeetingsNextPage = () => {
  const navigate = useNavigate();

  const { meetingId: paramMeetingId } = useParams();
  const [searchParams]                = useSearchParams();
  const meetingId = paramMeetingId || searchParams.get("meetingId");

  const [message, setMessage]           = useState("");
  const [chat, setChat]                 = useState([]);
  const [meeting, setMeeting]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [adminName, setAdminName]       = useState("Admin");
  const [adminAvatar, setAdminAvatar]   = useState("https://i.pravatar.cc/40");

  const chatEndRef = useRef(null);

  /* ── Fetch meeting data ── */
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        /* Admin profile */
        const profileRes  = await fetch(`${API_URL}/admin/info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        if (profileData.success && profileData.admin) {
          setAdminName(profileData.admin.name   || "Admin");
          setAdminAvatar(profileData.admin.avatar || "https://i.pravatar.cc/40");
        }

        /* Meeting data */
        if (meetingId) {
          const meetingRes  = await fetch(`${API_URL}/meetings/${meetingId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const meetingData = await meetingRes.json();

          if (meetingData.success && meetingData.meeting) {
            setMeeting(meetingData.meeting);
            if (meetingData.meeting.agendaItems?.length > 0) {
              setChat([{
                sender: "System",
                text:   `Agenda: ${meetingData.meeting.agendaItems.map(a => a.item).join(", ")}`,
                time:   new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
                type:   "system",
              }]);
            }
          }
        } else {
          /* Fallback — load first scheduled meeting */
          const allRes  = await fetch(`${API_URL}/meetings/all?status=Scheduled&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const allData = await allRes.json();
          if (allData.success && allData.meetings?.length > 0) {
            setMeeting(allData.meetings[0]);
          }
        }
      } catch (err) {
        console.error("❌ CaseMeetingsNextPage fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  /* ── Auto scroll ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* ── Send message ── */
  const handleSend = () => {
    if (!message.trim()) return;
    setChat([...chat, {
      sender: adminName,
      text:   message,
      time:   new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
      type:   "self",
    }]);
    setMessage("");
  };

  /* ── Participant helpers ── */
  const getOpponent = () => {
    if (!meeting) return { name: "Opponent", avatar: "https://i.pravatar.cc/500?img=12" };
    const p = meeting.participants?.find(p => p.role === "petitioner" || p.role === "defendant");
    if (p?.user) return { name: p.user.name || "Opponent", avatar: p.user.avatar || "https://i.pravatar.cc/500?img=12" };
    return { name: "Opponent", avatar: "https://i.pravatar.cc/500?img=12" };
  };

  const getMediator = () => {
    if (!meeting?.mediator) return { name: "Mediator", avatar: "https://i.pravatar.cc/500?img=32" };
    return { name: meeting.mediator.name || "Mediator", avatar: meeting.mediator.avatar || "https://i.pravatar.cc/500?img=32" };
  };

  const opponent = getOpponent();
  const mediator = getMediator();

  /* ── Chat participants ── */
  const chatParticipants = meeting?.participants?.filter(p => p.user)?.map(p => ({
    name:   p.user.name,
    role:   p.role || "Participant",
    avatar: p.user.avatar || `https://i.pravatar.cc/40?u=${p.user._id}`,
  })) || [
    { name: opponent.name, role: "Opponent", avatar: "https://i.pravatar.cc/40?img=12" },
    { name: mediator.name, role: "Mediator", avatar: "https://i.pravatar.cc/40?img=32" },
  ];

  /* ── ✅ Fixed ESLint: use these directly in JSX instead of unused variables ── */
  const caseLabel = meeting?.caseId
    ? `${meeting.caseId.caseId} — ${meeting.caseId.caseTitle}`
    : "Case Session";

  const joinLink = meeting?.virtualMeeting?.meetingLink || "";

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="menu">
          <div className="menu-item" onClick={() => navigate("/admin/dashboard")}>
            <img src={HomeIcon} alt="Home" /><span>Home</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/my-cases")}>
            <img src={CaseIcon} alt="My Cases" /><span>My Cases</span>
          </div>
          <div className="menu-item active" onClick={() => navigate("/admin/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" /><span>Case Meetings</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/chats")}>
            <img src={ChatIcon} alt="Chats" /><span>Chats</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/payments")}>
            <img src={PaymentIcon} alt="Payment" /><span>Payment</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/support")}>
            <img src={SupportIcon} alt="Support" /><span>Support</span>
          </div>
        </nav>
        <div className="logout">
          <div className="menu-item">
            <img src={LogoutIcon} alt="Logout" /><span>Log out</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="main-section">
        {/* Navbar */}
        <header className="navbar">
          <div></div>
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img src={adminAvatar} alt="profile" className="profile-img" />
              <span>{adminName}</span>
            </div>
          </div>
        </header>

        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh" }}>
            <p style={{ color:"#888" }}>Loading meeting...</p>
          </div>
        ) : (
          <div className="meeting-container">
            <div className="meeting-header">
              <button className="ongoing-btn">
                {meeting ? "On going meeting" : "No Active Meeting"}
              </button>
              {/* ✅ caseLabel used here — no more unused variable warning */}
              <button className="case-btn">{caseLabel}</button>
            </div>

            {/* Video Section */}
            <div className="video-section">
              <div className="video-card opponent">
                <img src={opponent.avatar} alt="Opponent" className="video-frame" />
                <span className="label">{opponent.name}</span>
              </div>
              <div className="video-card mediator">
                <img src={mediator.avatar} alt="Mediator" className="video-frame" />
                <span className="label">{mediator.name}</span>
              </div>
              <div className="video-small">
                <img src={adminAvatar} alt="You" className="video-frame-small" />
              </div>
            </div>

            {/* Controls */}
            <div className="controls">
              <FaVideo      className="control-icon" />
              <FaDesktop    className="control-icon" />
              <FaPhoneSlash
                className="control-icon end-call"
                style={{ cursor:"pointer" }}
                onClick={() => navigate("/admin/case-meetings")}
              />
              <FaMicrophone className="control-icon" />
              {/* ✅ joinLink used here — no more unused variable warning */}
              <FaCog
                className="control-icon"
                style={{ cursor: joinLink ? "pointer" : "default" }}
                onClick={() => joinLink && window.open(joinLink, "_blank")}
                title={joinLink ? "Open meeting link" : "No meeting link"}
              />
            </div>

            {/* Chat Section */}
            <div className="chat-section">
              <div className="chat-users">
                <h4>Chat Box</h4>
                {chatParticipants.map((p, i) => (
                  <div className="chat-user" key={i}>
                    <img src={p.avatar} alt={p.name} />
                    <div>
                      <p className="name">{p.name}</p>
                      <p className="role" style={{ textTransform:"capitalize" }}>{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-box">
                <div className="chat-messages">
                  <p className="chat-date">Today</p>
                  {chat.length === 0 ? (
                    <p style={{ color:"#aaa", fontSize:"13px", textAlign:"center", marginTop:"20px" }}>
                      No messages yet
                    </p>
                  ) : (
                    chat.map((msg, index) => (
                      <div key={index} className={`chat-message ${msg.type === "self" ? "self" : ""}`}>
                        {msg.type !== "self" && (
                          <p style={{ fontSize:"11px", color:"#888", marginBottom:"2px" }}>{msg.sender}</p>
                        )}
                        <p className="chat-text">{msg.text}</p>
                        <span className="chat-time">{msg.time}</span>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button onClick={handleSend}>&#9658;</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CaseMeetingsNextPage;