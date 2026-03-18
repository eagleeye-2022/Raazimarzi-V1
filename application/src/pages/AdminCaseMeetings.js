import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon    from "../assets/icons/home.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon    from "../assets/icons/newcase.png";
import ChatIcon    from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon  from "../assets/icons/logout.png";
import Vector      from "../assets/icons/Vector.png";
import "./AdminCaseMeetings.css";
import { FaCog, FaBell } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CaseMeetings = () => {
  const navigate = useNavigate();
  const [search, setSearch]               = useState("");
  const [loading, setLoading]             = useState(true);
  const [adminName, setAdminName]         = useState("Admin");
  const [adminAvatar, setAdminAvatar]     = useState("https://i.pravatar.cc/40");
  const [upcomingMeetings, setUpcoming]   = useState([]);
  const [todayMeetings, setToday]         = useState([]);
  const [filteredUpcoming, setFiltered]   = useState([]);

  /* ── Fetch all meetings ── */
  useEffect(() => {
    const fetchData = async () => {
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

        /* All meetings */
        const res  = await fetch(`${API_URL}/meetings/all?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          const now        = new Date();
          const startOfDay = new Date(now); startOfDay.setHours(0,0,0,0);
          const endOfDay   = new Date(now); endOfDay.setHours(23,59,59,999);

          const all      = data.meetings || [];
          const upcoming = all.filter(m => new Date(m.scheduledDate) > endOfDay);
          const today    = all.filter(m => {
            const d = new Date(m.scheduledDate);
            return d >= startOfDay && d <= endOfDay;
          });

          setUpcoming(upcoming);
          setFiltered(upcoming);
          setToday(today);
        }
      } catch (err) {
        console.error("❌ AdminCaseMeetings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ── Search filter ── */
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(upcomingMeetings);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      upcomingMeetings.filter(m =>
        m.caseId?.caseId?.toLowerCase().includes(q) ||
        m.caseId?.caseTitle?.toLowerCase().includes(q) ||
        m.meetingTitle?.toLowerCase().includes(q)
      )
    );
  }, [search, upcomingMeetings]);

  const handleReset = () => setSearch("");

  /* ── Format helpers ── */
  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
    : "—";

  const formatTime = (startTime, endTime) => {
    if (!startTime) return "—";
    return endTime ? `${startTime} - ${endTime}` : startTime;
  };

  const getDuration = (m) => {
    if (m.duration) return `${m.duration} minutes`;
    return "—";
  };

  /* ── Get participant by role ── */
  const getParticipant = (meeting, role) => {
    const p = meeting.participants?.find(p => p.role === role || p.role === "petitioner" || p.role === "defendant");
    if (p?.user) return { name: p.user.name || "Participant", avatar: p.user.avatar || `https://i.pravatar.cc/40?u=${p.user._id}` };
    return { name: "Participant", avatar: "https://i.pravatar.cc/40?img=1" };
  };

  const getMediator = (meeting) => {
    if (meeting.mediator) return { name: meeting.mediator.name || "Mediator", avatar: meeting.mediator.avatar || "https://i.pravatar.cc/40?img=2" };
    return { name: "Mediator", avatar: "https://i.pravatar.cc/40?img=2" };
  };

  /* ── Current month label ── */
  const currentMonth = new Date().toLocaleString("en-IN", { month:"long", year:"numeric" });

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="menu">
          <div className="menu-item" onClick={() => navigate("/admin/dashboard")}>
            <img src={HomeIcon} alt="Home" /><span>Home</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/new-cases")}>
            <img src={CaseIcon} alt="My Cases" /><span>New Cases</span>
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

        {/* Search bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by case id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="reset-btn" onClick={handleReset}>Reset</button>
        </div>

        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"50vh" }}>
            <p style={{ color:"#888" }}>Loading meetings...</p>
          </div>
        ) : (
          <section className="meetings-section">
            {/* Upcoming Meetings */}
            <div className="upcoming-meetings">
              <div className="section-header">
                <h3>Upcoming Cases Meetings ({currentMonth})</h3>
              </div>
              <div className="meeting-cards">
                {filteredUpcoming.length === 0 ? (
                  <p style={{ color:"#888", fontSize:"14px", padding:"16px 0" }}>
                    {search ? "No meetings match your search." : "No upcoming meetings."}
                  </p>
                ) : (
                  filteredUpcoming.slice(0, 8).map((m) => (
                    <div
                      key={m._id}
                      className="meeting-card"
                      style={{ cursor:"pointer" }}
                      onClick={() => navigate(`/admin/case-meetings/call?meetingId=${m._id}`)}
                    >
                      <div className="meeting-icon">
                        <img src={Vector} alt="Meeting logo" />
                      </div>
                      <div className="meeting-info">
                        <p className="date">{formatDate(m.scheduledDate)}</p>
                        <p className="time">{formatTime(m.startTime, m.endTime)}</p>
                        {m.caseId?.caseId && (
                          <p style={{ fontSize:"11px", color:"#888", marginTop:"2px" }}>
                            {m.caseId.caseId}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Today's Meeting */}
            <div className="today-meetings">
              <h3>Today's Meeting</h3>
              {todayMeetings.length === 0 ? (
                <p style={{ color:"#888", fontSize:"14px", padding:"16px 0" }}>
                  No meetings scheduled for today.
                </p>
              ) : (
                todayMeetings.map((m) => {
                  const opponent = getParticipant(m, "petitioner");
                  const mediator = getMediator(m);

                  return (
                    <div key={m._id} className="today-meeting-card">
                      <div className="time-section">
                        <h4>{m.startTime || "—"}</h4>
                        <p>{getDuration(m)}</p>
                      </div>
                      <div className="user-section">
                        <div className="user">
                          <img src={opponent.avatar} alt="Opponent" />
                          <p>{opponent.name} <span>Opponent</span></p>
                        </div>
                        <div className="user">
                          <img src={mediator.avatar} alt="Mediator" />
                          <p>{mediator.name} <span>Mediator</span></p>
                        </div>
                      </div>
                      <div className="category-section">
                        <a href="/" className="category">Category</a>
                        <p style={{ textTransform:"capitalize" }}>
                          {m.caseId?.caseTitle || m.meetingType || "General"}
                        </p>
                      </div>
                      <button
                        className="join-btn"
                        onClick={() => navigate(`/admin/case-meetings/call?meetingId=${m._id}`)}
                      >
                        Join Now
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default CaseMeetings;