import React, { useState, useEffect } from "react";
import "./CaseManagerDashboard.css";
import { useNavigate } from "react-router-dom";
import ActiveIcon   from "../assets/icons/active.png";
import CurrentIcon  from "../assets/icons/current.png";
import TotalIcon    from "../assets/icons/total.png";
import HomeIcon     from "../assets/icons/home.png";
import CaseIcon     from "../assets/icons/newcase.png";
import MeetingIcon  from "../assets/icons/meeting.png";
import DocumentIcon from "../assets/icons/document.png";
import ChatIcon     from "../assets/icons/chat.png";
import PaymentIcon  from "../assets/icons/payment.png";
import SupportIcon  from "../assets/icons/support.png";
import LogoutIcon   from "../assets/icons/logout.png";
import { FaCog, FaBell } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CaseManagerDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading]           = useState(true);
  const [cmName, setCmName]             = useState("Case Manager");
  const [cmAvatar, setCmAvatar]         = useState("https://i.pravatar.cc/40");
  const [stats, setStats]               = useState({ total:0, active:0, pending:0, resolved:0 });
  const [cases, setCases]               = useState([]);
  const [todayMeeting, setTodayMeeting] = useState(null);
  const [documents, setDocuments]       = useState([]);

  /* ── Schedule Meeting Modal ── */
  const [showModal, setShowModal]       = useState(false);
  const [selectedCase, setSelectedCase] = useState("");
  const [mediators, setMediators]       = useState([]);
  const [form, setForm]                 = useState({
    meetingTitle:  "",
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

  /* ── Fetch dashboard data ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        /* Profile */
        const meRes  = await fetch(`${API_URL}/cases/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const meData = await meRes.json();
        if (meData.success) {
          setCmName(meData.name   || "Case Manager");
          setCmAvatar(meData.avatar || "https://i.pravatar.cc/40");
        }

        /* Stats */
        const statsRes  = await fetch(`${API_URL}/case-manager/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);

        /* My assigned cases */
        const casesRes  = await fetch(`${API_URL}/case-manager/cases?limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const casesData = await casesRes.json();
        if (casesData.success) setCases(casesData.cases || []);

        /* Today's meetings */
        const meetRes  = await fetch(`${API_URL}/meetings/my?upcoming=true&limit=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const meetData = await meetRes.json();
        if (meetData.success && meetData.upcoming?.length > 0) {
          setTodayMeeting(meetData.upcoming[0]);
        }

        /* Mediators list for schedule modal */
        const medRes  = await fetch(`${API_URL}/admin/staff/mediators`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const medData = await medRes.json();
        if (medData.success) setMediators(medData.mediators || []);

      } catch (err) {
        console.error("❌ CaseManagerDashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Schedule Meeting ── */
  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    if (!selectedCase) { setScheduleMsg("Please select a case"); return; }
    if (!form.scheduledDate || !form.startTime || !form.endTime) {
      setScheduleMsg("Date, start time and end time are required");
      return;
    }

    try {
      setScheduling(true);
      setScheduleMsg("");
      const token = localStorage.getItem("token");

      const body = {
        caseId:       selectedCase,
        meetingTitle: form.meetingTitle || `${form.meetingType} — ${form.scheduledDate}`,
        meetingType:  form.meetingType,
        scheduledDate: form.scheduledDate,
        startTime:    form.startTime,
        endTime:      form.endTime,
        mediatorId:   form.mediatorId || undefined,
        locationType: "virtual",
        virtualMeeting: form.meetingLink ? { meetingLink: form.meetingLink, platform: "custom" } : undefined,
        agendaItems: form.agendaItems
          ? form.agendaItems.split("\n").filter(Boolean).map((item, i) => ({ item, order: i + 1 }))
          : [],
      };

      const res  = await fetch(`${API_URL}/meetings`, {
        method:  "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setScheduleMsg("✅ Meeting scheduled successfully!");
        setShowModal(false);
        setForm({ meetingTitle:"", meetingType:"Mediation Session", scheduledDate:"", startTime:"", endTime:"", mediatorId:"", meetingLink:"", agendaItems:"" });
        // Refresh meetings
        const meetRes  = await fetch(`${API_URL}/meetings/my?upcoming=true&limit=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const meetData = await meetRes.json();
        if (meetData.success && meetData.upcoming?.length > 0) setTodayMeeting(meetData.upcoming[0]);
      } else {
        setScheduleMsg(`❌ ${data.message || "Failed to schedule meeting"}`);
      }
    } catch (err) {
      setScheduleMsg("❌ Server error. Please try again.");
    } finally {
      setScheduling(false);
    }
  };

  /* ── Helpers ── */
  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
    : "—";

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (["resolved","awarded"].includes(s))      return { color:"#16a34a" };
    if (["in-progress","mediation","arbitration","hearing","notice-sent"].includes(s))
                                                  return { color:"#1d4ed8" };
    if (["pending","pending-review"].includes(s)) return { color:"#854d0e" };
    if (["rejected","withdrawn"].includes(s))     return { color:"#dc2626" };
    return { color:"#16a34a" };
  };

  const currentMonth = new Date().toLocaleString("en-IN", { month:"long", year:"numeric" });

  if (loading) return (
    <div className="dashboard-container">
      <aside className="sidebar"><h2 className="sidebar-title">Dashboard</h2></aside>
      <main className="main-content" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ color:"#888" }}>Loading...</p>
      </main>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="menu">
          <div className="menu-item active" onClick={() => navigate("/cm/dashboard")}>
            <img src={HomeIcon} alt="Home" /><span>Home</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/new-cases")}>
            <img src={CaseIcon} alt="New Cases" /><span>New Cases</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" /><span>Case Meetings</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/client-docs")}>
            <img src={DocumentIcon} alt="Documents" /><span>Clients Documents</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/chats")}>
            <img src={ChatIcon} alt="Chats" /><span>Chats</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/payment")}>
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
      <main className="main-content">
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

        {/* Stats */}
        <section className="stats">
          <div className="stat-card green">
            <div className="stat-left">
              <p className="stat-label">Active Case</p>
              <h2 className="stat-value">{String(stats.active || 0).padStart(2,"0")}</h2>
            </div>
            <div className="stat-right">
              <img src={ActiveIcon} alt="Active Case" className="stat-icon" />
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-left">
              <p className="stat-label">Pending Review</p>
              <h2 className="stat-value">{String(stats.pendingReview || 0).padStart(2,"0")}</h2>
            </div>
            <div className="stat-right">
              <img src={CurrentIcon} alt="Pending" className="stat-icon" />
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-left">
              <p className="stat-label">Total Case</p>
              <h2 className="stat-value">{String(stats.total || 0).padStart(2,"0")}</h2>
            </div>
            <div className="stat-right">
              <img src={TotalIcon} alt="Total Case" className="stat-icon" />
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-left">
              <p className="stat-label">Resolution Rate</p>
              <h2 className="stat-value">+{stats.resolutionRate || 0}%</h2>
            </div>
            <div className="stat-right">
              <img src={ActiveIcon} alt="Rate" className="stat-icon" />
            </div>
          </div>
        </section>

        {/* Assigned Cases Table */}
        <section className="cm-new-cases">
          <div className="cm-section-header">
            <h3>Assigned Cases ({currentMonth})</h3>
            <button onClick={() => navigate("/cm/new-cases")}>View all</button>
          </div>
          {cases.length === 0 ? (
            <p style={{ color:"#888", padding:"16px 0" }}>No cases assigned yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Party 1</th>
                  <th>Party 2</th>
                  <th>Category</th>
                  <th>Neutral</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.slice(0, 5).map((c) => {
                  const neutral = c.assignedNeutral || c.assignedMediator;
                  return (
                    <tr key={c._id}>
                      <td>{c.caseId}</td>
                      <td>{c.caseTitle}</td>
                      <td>{c.petitionerDetails?.fullName || c.claimant?.name || "N/A"}</td>
                      <td>{c.defendantDetails?.fullName  || c.respondent?.name || "N/A"}</td>
                      <td style={{ textTransform:"capitalize" }}>{c.caseType || "General"}</td>
                      <td className="cm-assigned">
                        {neutral?.avatar && <img src={neutral.avatar} alt="neutral" />}
                        {neutral?.name || "Not Assigned"}
                      </td>
                      <td className="cm-status active" style={getStatusStyle(c.status)}>
                        {c.status}
                      </td>
                      <td>
                        <button
                          style={{ padding:"4px 10px", fontSize:"12px", cursor:"pointer", background:"#7C3AED", color:"#fff", border:"none", borderRadius:"4px" }}
                          onClick={() => { setSelectedCase(c._id); setShowModal(true); }}
                        >
                          Schedule Meeting
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        {/* Middle Section */}
        <section className="admin-middle">
          {/* Today's Meeting */}
          <div className="admin-meeting-section">
            <h3 className="admin-meeting-title">Meeting Scheduled</h3>
            <div className="admin-meeting-container">
              {todayMeeting ? (
                <>
                  <div className="admin-meeting-header">
                    <div>
                      <p className="admin-meeting-day">Next Meeting</p>
                      <p className="admin-meeting-time">{todayMeeting.startTime} - {todayMeeting.endTime}</p>
                    </div>
                    <span className="admin-meeting-date">{formatDate(todayMeeting.scheduledDate)}</span>
                  </div>
                  <div className="admin-meeting-list">
                    <div className="admin-meeting-row">
                      <p><strong>Case Id:</strong> {todayMeeting.caseId?.caseId || "—"}</p>
                      <p><strong>Title:</strong> {todayMeeting.caseId?.caseTitle || todayMeeting.meetingTitle || "—"}</p>
                      <p><strong>Type:</strong> {todayMeeting.meetingType || "Meeting"}</p>
                    </div>
                  </div>
                  <div className="admin-meeting-footer">
                    <button
                      className="admin-join-btn"
                      onClick={() => navigate(`/cm/case-meetings/call?meetingId=${todayMeeting._id}`)}
                    >
                      Join now
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="admin-meeting-header">
                    <div>
                      <p className="admin-meeting-day">No upcoming meetings</p>
                      <p className="admin-meeting-time">Schedule one below</p>
                    </div>
                  </div>
                  <div className="admin-meeting-footer">
                    <button
                      className="admin-join-btn"
                      onClick={() => setShowModal(true)}
                      style={{ background:"#7C3AED" }}
                    >
                      + Schedule Meeting
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Documents summary */}
          <div className="clients-documents">
            <h3 className="clients-title">Clients Documents</h3>
            <div className="clients-header">
              <input type="text" placeholder="🔍 Search by case id..." className="search-input" />
            </div>
            <p style={{ color:"#888", fontSize:"14px", marginTop:"16px" }}>
              Select a case to view documents.
            </p>
            <button
              style={{ marginTop:"12px", padding:"8px 16px", background:"#7C3AED", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer" }}
              onClick={() => navigate("/cm/client-docs")}
            >
              View All Documents
            </button>
          </div>
        </section>

        {/* Schedule Meeting success message */}
        {scheduleMsg && (
          <p style={{ padding:"12px 20px", color: scheduleMsg.includes("✅") ? "#16a34a" : "#dc2626", fontWeight:500 }}>
            {scheduleMsg}
          </p>
        )}
      </main>

      {/* ── Schedule Meeting Modal ── */}
      {showModal && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000,
        }}>
          <div style={{
            background:"#fff", borderRadius:"12px", padding:"32px",
            width:"100%", maxWidth:"520px", maxHeight:"90vh", overflowY:"auto",
          }}>
            <h3 style={{ marginBottom:"20px", fontSize:"18px", fontWeight:700 }}>
              Schedule Meeting
            </h3>

            <form onSubmit={handleScheduleMeeting}>
              {/* Case select */}
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>
                  Select Case *
                </label>
                <select
                  value={selectedCase}
                  onChange={(e) => setSelectedCase(e.target.value)}
                  style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }}
                  required
                >
                  <option value="">-- Select a case --</option>
                  {cases.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.caseId} — {c.caseTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meeting type */}
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>
                  Meeting Type *
                </label>
                <select
                  value={form.meetingType}
                  onChange={(e) => setForm({ ...form, meetingType: e.target.value })}
                  style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }}
                >
                  <option>Initial Consultation</option>
                  <option>Mediation Session</option>
                  <option>Hearing</option>
                  <option>Settlement Discussion</option>
                  <option>Evidence Presentation</option>
                  <option>Final Hearing</option>
                  <option>Follow-up Meeting</option>
                </select>
              </div>

              {/* Date */}
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={form.scheduledDate}
                  onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }}
                  required
                />
              </div>

              {/* Time */}
              <div style={{ display:"flex", gap:"12px", marginBottom:"14px" }}>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>Start Time *</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }}
                    required
                  />
                </div>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>End Time *</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }}
                    required
                  />
                </div>
              </div>

              {/* Mediator */}
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>
                  Assign Mediator/Arbitrator
                </label>
                <select
                  value={form.mediatorId}
                  onChange={(e) => setForm({ ...form, mediatorId: e.target.value })}
                  style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }}
                >
                  <option value="">-- Select neutral (optional) --</option>
                  {mediators.map((m) => (
                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>

              {/* Meeting link */}
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>
                  Meeting Link (Google Meet / Zoom)
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={form.meetingLink}
                  onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                  style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" }}
                />
              </div>

              {/* Agenda */}
              <div style={{ marginBottom:"20px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, display:"block", marginBottom:"4px" }}>
                  Agenda Items (one per line)
                </label>
                <textarea
                  placeholder="Review property documents&#10;Hear claimant's statement&#10;Hear respondent's statement"
                  value={form.agendaItems}
                  onChange={(e) => setForm({ ...form, agendaItems: e.target.value })}
                  rows={3}
                  style={{ width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db", resize:"vertical" }}
                />
              </div>

              {scheduleMsg && (
                <p style={{ marginBottom:"12px", color: scheduleMsg.includes("✅") ? "#16a34a" : "#dc2626", fontSize:"13px" }}>
                  {scheduleMsg}
                </p>
              )}

              <div style={{ display:"flex", gap:"12px" }}>
                <button
                  type="submit"
                  disabled={scheduling}
                  style={{ flex:1, padding:"10px", background:"#7C3AED", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontWeight:600 }}
                >
                  {scheduling ? "Scheduling..." : "Schedule Meeting"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setScheduleMsg(""); }}
                  style={{ flex:1, padding:"10px", background:"#f3f4f6", color:"#333", border:"none", borderRadius:"6px", cursor:"pointer" }}
                >
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

export default CaseManagerDashboard;