import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon     from "../assets/icons/home.png";
import MeetingIcon  from "../assets/icons/meeting.png";
import CaseIcon     from "../assets/icons/newcase.png";
import DocumentIcon from "../assets/icons/document.png";
import ChatIcon     from "../assets/icons/chat.png";
import PaymentIcon  from "../assets/icons/payment.png";
import SupportIcon  from "../assets/icons/support.png";
import LogoutIcon   from "../assets/icons/logout.png";
import Vector       from "../assets/icons/Vector.png";
import "./CaseManagerCaseMeetings.css";
import { FaCog, FaBell } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CaseManagerCaseMeetings = () => {
  const navigate = useNavigate();

  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const [cmName, setCmName]             = useState("Case Manager");
  const [cmAvatar, setCmAvatar]         = useState("https://i.pravatar.cc/40");
  const [upcomingMeetings, setUpcoming] = useState([]);
  const [todayMeetings, setToday]       = useState([]);
  const [filteredUpcoming, setFiltered] = useState([]);
  const [myCases, setMyCases]           = useState([]);
  const [mediators, setMediators]       = useState([]);

  /* ── Schedule Modal ── */
  const [showModal, setShowModal]       = useState(false);
  const [selectedCase, setSelectedCase] = useState("");
  const [form, setForm]                 = useState({
    meetingType:   "Mediation Session",
    scheduledDate: "",
    startTime:     "",
    endTime:       "",
    mediatorId:    "",
    meetingLink:   "",
    agendaItems:   "",
  });
  const [scheduling, setScheduling]     = useState(false);
  const [scheduleMsg, setScheduleMsg]   = useState("");

  /* ── Fetch data ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        /* Profile */
        const meRes  = await fetch(`${API_URL}/cases/me`, { headers:{ Authorization:`Bearer ${token}` } });
        const meData = await meRes.json();
        if (meData.success) { setCmName(meData.name || "Case Manager"); setCmAvatar(meData.avatar || "https://i.pravatar.cc/40"); }

        /* All my meetings */
        const res  = await fetch(`${API_URL}/meetings/my?limit=50`, { headers:{ Authorization:`Bearer ${token}` } });
        const data = await res.json();
        if (data.success) {
          setUpcoming(data.upcoming || []);
          setFiltered(data.upcoming  || []);
          setToday((data.upcoming || []).filter(m => {
            const d = new Date(m.scheduledDate);
            const now = new Date();
            return d.toDateString() === now.toDateString();
          }));
        }

        /* My cases for schedule modal */
        const casesRes  = await fetch(`${API_URL}/case-manager/cases?limit=50`, { headers:{ Authorization:`Bearer ${token}` } });
        const casesData = await casesRes.json();
        if (casesData.success) setMyCases(casesData.cases || []);

        /* Mediators */
        const medRes  = await fetch(`${API_URL}/admin/staff/mediators`, { headers:{ Authorization:`Bearer ${token}` } });
        const medData = await medRes.json();
        if (medData.success) setMediators(medData.mediators || []);

      } catch (err) {
        console.error("❌ CaseManagerCaseMeetings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Search filter ── */
  useEffect(() => {
    if (!search.trim()) { setFiltered(upcomingMeetings); return; }
    const q = search.toLowerCase();
    setFiltered(upcomingMeetings.filter(m =>
      m.caseId?.caseId?.toLowerCase().includes(q) ||
      m.caseId?.caseTitle?.toLowerCase().includes(q) ||
      m.meetingTitle?.toLowerCase().includes(q)
    ));
  }, [search, upcomingMeetings]);

  /* ── Schedule Meeting ── */
  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!selectedCase || !form.scheduledDate || !form.startTime || !form.endTime) {
      setScheduleMsg("Please fill all required fields"); return;
    }
    try {
      setScheduling(true); setScheduleMsg("");
      const token = localStorage.getItem("token");
      const body = {
        caseId: selectedCase,
        meetingTitle: `${form.meetingType} — ${form.scheduledDate}`,
        meetingType:  form.meetingType,
        scheduledDate: form.scheduledDate,
        startTime:    form.startTime,
        endTime:      form.endTime,
        mediatorId:   form.mediatorId || undefined,
        locationType: "virtual",
        virtualMeeting: form.meetingLink ? { meetingLink: form.meetingLink, platform:"custom" } : undefined,
        agendaItems: form.agendaItems
          ? form.agendaItems.split("\n").filter(Boolean).map((item, i) => ({ item, order: i+1 }))
          : [],
      };
      const res  = await fetch(`${API_URL}/meetings`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setScheduleMsg("✅ Meeting scheduled!");
        setShowModal(false);
        // Add to upcoming list
        if (data.meeting) setUpcoming(prev => [data.meeting, ...prev]);
      } else {
        setScheduleMsg(`❌ ${data.message}`);
      }
    } catch (err) {
      setScheduleMsg("❌ Server error");
    } finally {
      setScheduling(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";
  const currentMonth = new Date().toLocaleString("en-IN", { month:"long", year:"numeric" });

  const getParticipant = (meeting) => {
    const p = meeting.participants?.find(p => p.role === "petitioner" || p.role === "defendant");
    if (p?.user) return { name: p.user.name, avatar: p.user.avatar || "https://i.pravatar.cc/40?img=1" };
    return { name: "Participant", avatar: "https://i.pravatar.cc/40?img=1" };
  };

  const getMediator = (meeting) => {
    if (meeting.mediator) return { name: meeting.mediator.name, avatar: meeting.mediator.avatar || "https://i.pravatar.cc/40?img=2" };
    return { name: "Mediator", avatar: "https://i.pravatar.cc/40?img=2" };
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="menu">
          <div className="menu-item" onClick={() => navigate("/cm/dashboard")}>
            <img src={HomeIcon} alt="Home" /><span>Home</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/new-cases")}>
            <img src={CaseIcon} alt="My Cases" /><span>New Cases</span>
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
        {/* Navbar */}
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

        {/* Search + Schedule button */}
        <div className="search-bar" style={{ display:"flex", gap:"12px", alignItems:"center" }}>
          <input
            type="text"
            placeholder="Search by case id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="reset-btn" onClick={() => setSearch("")}>Reset</button>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding:"8px 18px", background:"#7C3AED", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontWeight:600, whiteSpace:"nowrap" }}
          >
            + Schedule Meeting
          </button>
        </div>

        {scheduleMsg && (
          <p style={{ padding:"8px 0 0 0", color: scheduleMsg.includes("✅") ? "#16a34a" : "#dc2626", fontWeight:500 }}>
            {scheduleMsg}
          </p>
        )}

        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"50vh" }}>
            <p style={{ color:"#888" }}>Loading meetings...</p>
          </div>
        ) : (
          <section className="meetings-section">
            {/* Upcoming Meetings */}
            <div className="upcoming-meetings">
              <div className="section-header">
                <h3>Upcoming Meetings ({currentMonth})</h3>
              </div>
              <div className="meeting-cards">
                {filteredUpcoming.length === 0 ? (
                  <p style={{ color:"#888", fontSize:"14px", padding:"16px 0" }}>
                    {search ? "No meetings match your search." : "No upcoming meetings. Schedule one!"}
                  </p>
                ) : (
                  filteredUpcoming.slice(0, 8).map((m) => (
                    <div
                      key={m._id}
                      className="meeting-card"
                      style={{ cursor:"pointer" }}
                      onClick={() => navigate(`/cm/case-meetings/call?meetingId=${m._id}`)}
                    >
                      <div className="meeting-icon">
                        <img src={Vector} alt="Meeting logo" />
                      </div>
                      <div className="meeting-info">
                        <p className="date">{formatDate(m.scheduledDate)}</p>
                        <p className="time">{m.startTime} - {m.endTime}</p>
                        {m.caseId?.caseId && (
                          <p style={{ fontSize:"11px", color:"#888", marginTop:"2px" }}>{m.caseId.caseId}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Today's Meetings */}
            <div className="today-meetings">
              <h3>Today's Meeting</h3>
              {todayMeetings.length === 0 ? (
                <p style={{ color:"#888", fontSize:"14px", padding:"16px 0" }}>No meetings today.</p>
              ) : (
                todayMeetings.map((m) => {
                  const opponent = getParticipant(m);
                  const mediator = getMediator(m);
                  return (
                    <div key={m._id} className="today-meeting-card">
                      <div className="time-section">
                        <h4>{m.startTime || "—"}</h4>
                        <p>{m.duration ? `${m.duration} minutes` : "—"}</p>
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
                        onClick={() => navigate(`/cm/case-meetings/call?meetingId=${m._id}`)}
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

      {/* ── Schedule Meeting Modal ── */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", borderRadius:"12px", padding:"32px", width:"100%", maxWidth:"500px", maxHeight:"90vh", overflowY:"auto" }}>
            <h3 style={{ marginBottom:"20px", fontSize:"18px", fontWeight:700 }}>Schedule Meeting</h3>
            <form onSubmit={handleSchedule}>
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>Select Case *</label>
                <select value={selectedCase} onChange={(e) => setSelectedCase(e.target.value)} style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }} required>
                  <option value="">-- Select a case --</option>
                  {myCases.map((c) => <option key={c._id} value={c._id}>{c.caseId} — {c.caseTitle}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>Meeting Type *</label>
                <select value={form.meetingType} onChange={(e) => setForm({ ...form, meetingType: e.target.value })} style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }}>
                  <option>Initial Consultation</option>
                  <option>Mediation Session</option>
                  <option>Hearing</option>
                  <option>Settlement Discussion</option>
                  <option>Evidence Presentation</option>
                  <option>Final Hearing</option>
                  <option>Follow-up Meeting</option>
                </select>
              </div>
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>Date *</label>
                <input type="date" value={form.scheduledDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }} required />
              </div>
              <div style={{ display:"flex", gap:"12px", marginBottom:"14px" }}>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>Start Time *</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }} required />
                </div>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>End Time *</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }} required />
                </div>
              </div>
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>Mediator/Arbitrator</label>
                <select value={form.mediatorId} onChange={(e) => setForm({ ...form, mediatorId: e.target.value })} style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }}>
                  <option value="">-- Select (optional) --</option>
                  {mediators.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>Meeting Link</label>
                <input type="url" placeholder="https://meet.google.com/..." value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }} />
              </div>
              <div style={{ marginBottom:"20px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>Agenda (one per line)</label>
                <textarea rows={3} placeholder="Agenda item 1&#10;Agenda item 2" value={form.agendaItems} onChange={(e) => setForm({ ...form, agendaItems: e.target.value })} style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db", resize:"vertical" }} />
              </div>
              {scheduleMsg && <p style={{ marginBottom:"12px", color: scheduleMsg.includes("✅") ? "#16a34a" : "#dc2626", fontSize:"13px" }}>{scheduleMsg}</p>}
              <div style={{ display:"flex", gap:"12px" }}>
                <button type="submit" disabled={scheduling} style={{ flex:1, padding:"10px", background:"#7C3AED", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontWeight:600 }}>
                  {scheduling ? "Scheduling..." : "Schedule"}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setScheduleMsg(""); }} style={{ flex:1, padding:"10px", background:"#f3f4f6", color:"#333", border:"none", borderRadius:"6px", cursor:"pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagerCaseMeetings;