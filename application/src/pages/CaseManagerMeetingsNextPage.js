import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import HomeIcon     from "../assets/icons/home.png";
import MeetingIcon  from "../assets/icons/meeting.png";
import CaseIcon     from "../assets/icons/newcase.png";
import DocumentIcon from "../assets/icons/document.png";
import ChatIcon     from "../assets/icons/chat.png";
import PaymentIcon  from "../assets/icons/payment.png";
import SupportIcon  from "../assets/icons/support.png";
import LogoutIcon   from "../assets/icons/logout.png";
import "../pages/CaseManagerMeetingsNextPage.css";
import { FaCog, FaBell, FaVideo, FaPhoneSlash, FaMicrophone, FaDesktop } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CaseManagerMeetingsNextPage = () => {
  const navigate = useNavigate();

  const { meetingId: paramMeetingId } = useParams();
  const [searchParams]                = useSearchParams();
  const meetingId = paramMeetingId || searchParams.get("meetingId");

  const [message, setMessage]         = useState("");
  const [chat, setChat]               = useState([]);
  const [meeting, setMeeting]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [cmName, setCmName]           = useState("Case Manager");
  const [cmAvatar, setCmAvatar]       = useState("https://i.pravatar.cc/40");

  const chatEndRef = useRef(null);

  /* ── Fetch meeting ── */
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        /* Profile */
        const meRes  = await fetch(`${API_URL}/cases/me`, { headers:{ Authorization:`Bearer ${token}` } });
        const meData = await meRes.json();
        if (meData.success) { setCmName(meData.name || "Case Manager"); setCmAvatar(meData.avatar || "https://i.pravatar.cc/40"); }

        /* Meeting */
        if (meetingId) {
          const res  = await fetch(`${API_URL}/meetings/${meetingId}`, { headers:{ Authorization:`Bearer ${token}` } });
          const data = await res.json();
          if (data.success && data.meeting) {
            setMeeting(data.meeting);
            if (data.meeting.agendaItems?.length > 0) {
              setChat([{
                sender: "System",
                text:   `Agenda: ${data.meeting.agendaItems.map(a => a.item).join(", ")}`,
                time:   new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
                type:   "system",
              }]);
            }
          }
        } else {
          const res  = await fetch(`${API_URL}/meetings/my?upcoming=true&limit=1`, { headers:{ Authorization:`Bearer ${token}` } });
          const data = await res.json();
          if (data.success && data.upcoming?.length > 0) setMeeting(data.upcoming[0]);
        }
      } catch (err) {
        console.error("❌ CaseManagerMeetingsNextPage fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [meetingId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [chat]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChat([...chat, {
      sender: cmName,
      text:   message,
      time:   new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
      type:   "self",
    }]);
    setMessage("");
  };

  const getOpponent = () => {
    if (!meeting) return { name:"Opponent", avatar:"https://i.pravatar.cc/500?img=12" };
    const p = meeting.participants?.find(p => p.role === "petitioner" || p.role === "defendant");
    if (p?.user) return { name: p.user.name || "Opponent", avatar: p.user.avatar || "https://i.pravatar.cc/500?img=12" };
    return { name:"Opponent", avatar:"https://i.pravatar.cc/500?img=12" };
  };

  const getMediator = () => {
    if (!meeting?.mediator) return { name:"Mediator", avatar:"https://i.pravatar.cc/500?img=32" };
    return { name: meeting.mediator.name || "Mediator", avatar: meeting.mediator.avatar || "https://i.pravatar.cc/500?img=32" };
  };

  const opponent = getOpponent();
  const mediator = getMediator();

  const chatParticipants = meeting?.participants?.filter(p => p.user)?.map(p => ({
    name:   p.user.name,
    role:   p.role || "Participant",
    avatar: p.user.avatar || `https://i.pravatar.cc/40?u=${p.user._id}`,
  })) || [
    { name: opponent.name, role:"Opponent", avatar:"https://i.pravatar.cc/40?img=12" },
    { name: mediator.name, role:"Mediator", avatar:"https://i.pravatar.cc/40?img=32" },
  ];

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
          <div className="menu-item" onClick={() => navigate("/cm/dashboard")}>
            <img src={HomeIcon} alt="Home" /><span>Home</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/my-cases")}>
            <img src={CaseIcon} alt="My Cases" /><span>My Cases</span>
          </div>
          <div className="menu-item active" onClick={() => navigate("/cm/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" /><span>Case Meetings</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/client-docs")}>
            <img src={DocumentIcon} alt="Documents" /><span>Clients Documents</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/chats")}>
            <img src={ChatIcon} alt="Chats" /><span>Chats</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/payments")}>
            <img src={PaymentIcon} alt="Payment" /><span>Payment</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/support")}>
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
        <header className="navbar">
          <div></div>
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img src={cmAvatar} alt="profile" className="profile-img" />
              <span>{cmName}</span>
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
              <button className="ongoing-btn">{meeting ? "On going meeting" : "No Active Meeting"}</button>
              <button className="case-btn">{caseLabel}</button>
            </div>

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
                <img src={cmAvatar} alt="You" className="video-frame-small" />
              </div>
            </div>

            <div className="controls">
              <FaVideo      className="control-icon" />
              <FaDesktop    className="control-icon" />
              <FaPhoneSlash className="control-icon end-call" style={{ cursor:"pointer" }} onClick={() => navigate("/cm/case-meetings")} />
              <FaMicrophone className="control-icon" />
              <FaCog        className="control-icon" style={{ cursor: joinLink ? "pointer":"default" }} onClick={() => joinLink && window.open(joinLink,"_blank")} title={joinLink ? "Open meeting link" : "No link"} />
            </div>

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
                    <p style={{ color:"#aaa", fontSize:"13px", textAlign:"center", marginTop:"20px" }}>No messages yet</p>
                  ) : (
                    chat.map((msg, i) => (
                      <div key={i} className={`chat-message ${msg.type === "self" ? "self" : ""}`}>
                        {msg.type !== "self" && <p style={{ fontSize:"11px", color:"#888", marginBottom:"2px" }}>{msg.sender}</p>}
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

export default CaseManagerMeetingsNextPage;