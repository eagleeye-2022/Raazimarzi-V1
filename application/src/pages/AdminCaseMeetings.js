// src/pages/AdminMeetings.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell, FaSearch, FaChevronDown, FaChevronUp,
  FaChevronLeft, FaChevronRight, FaSync, FaVideo,
  FaUser, FaShoppingBag, FaBuilding,
} from "react-icons/fa";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminCaseMeetings.css";

/* ─── Constants ─── */
const STATUS_OPTIONS     = ["All Statuses","Ongoing","Upcoming","Missed","Completed","Cancelled"];
const INVITATION_OPTIONS = ["All Type","Invited","Optional","Not Required"];
const ROWS_OPTIONS       = [5,10,20,50];

const CATEGORY_TREE = [
  { group:"Individual", icon:<FaUser />,        sub:["Property & Rental Disputes","Family Disputes","Neighbour & Community"] },
  { group:"Consumer",   icon:<FaShoppingBag />, sub:["Product Complaints","Service Complaints","Delivery Issues","Refund & Billing Disputes"] },
  { group:"Commercial", icon:<FaBuilding />,    sub:["Trade & Business Disputes","Finance & Banking Disputes","Corporate & Business Agreement Disputes","Construction & Infrastructure Disputes","Commercial Property Disputes","Intellectual Property Disputes","Technology & Digital Disputes","Franchise & Distribution Disputes","Employment & Workforce Disputes","Contract & Agreement Disputes"] },
];

/* ─── Mock data ─── */
const MOCK = Array.from({length:14},(_,i)=>({
  _id:String(i+1),
  meetingId:`#${2544+i}`,
  caseId:`#${4245+i}`,
  meetingTitle:["Property Division","Employment Dispute","Family Settlement","Contract Breach","Consumer Complaint"][i%5],
  petitioner:["Rahul Sharma","Priya Menon","Arun Kumar","Sunita Rao"][i%4],
  respondent:["Karthik","Tech Corp Ltd","Retailer Pvt","Landlord Inc"][i%4],
  mediator:"Kumar Sangakara",
  status:["Ongoing","Upcoming","Upcoming","Missed","Completed"][i%5],
  invitation:["Invited","Optional","Not Required","Optional","Invited"][i%5],
  scheduledDate:"2026-05-12",
  startTime:"10:00",
  endTime:"11:00",
  virtualMeeting:{ meetingLink:"https://meet.google.com/abc-defg-hij" },
  caseType:["Property & Rental Disputes","Employment & Workforce Disputes","Family Disputes","Contract & Agreement Disputes"][i%4],
}));

/* ─── Helpers ─── */
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"}) : "—";
const fmt12   = t => { if(!t) return "—"; const [h,m]=t.split(":").map(Number); return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`; };

const getStatusDot = s => {
  if(s==="Ongoing")   return "adm3-dot--green";
  if(s==="Upcoming")  return "adm3-dot--yellow";
  if(s==="Missed")    return "adm3-dot--red";
  if(s==="Completed") return "adm3-dot--blue";
  return "adm3-dot--grey";
};

/* ─── Dropdown ─── */
const Dropdown = ({options,value,onChange}) => {
  const [open,setOpen] = useState(false);
  const ref = useRef();
  useEffect(()=>{ const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h); },[]);
  return (
    <div className="adm3-dd" ref={ref}>
      <button className={`adm3-dd__trigger ${open?"open":""}`} onClick={()=>setOpen(p=>!p)}>
        <span>{value}</span>
        {open?<FaChevronUp className="adm3-dd__chev"/>:<FaChevronDown className="adm3-dd__chev"/>}
      </button>
      {open&&(
        <div className="adm3-dd__menu">
          {options.map(o=>(
            <div key={o} className="adm3-dd__item" onClick={()=>{onChange(o);setOpen(false);}}>
              <span>{o}</span>
              <span className={`adm3-radio ${value===o?"adm3-radio--on":""}`}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Category Dropdown ─── */
const CategoryDropdown = ({value,onChange}) => {
  const [open,setOpen]     = useState(false);
  const [exp,setExp]       = useState({});
  const ref = useRef();
  useEffect(()=>{ const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h); },[]);
  return (
    <div className="adm3-dd adm3-cat-dd" ref={ref}>
      <button className={`adm3-dd__trigger ${open?"open":""}`} onClick={()=>setOpen(p=>!p)}>
        <span className="adm3-cat-trigger">{value}</span>
        {open?<FaChevronUp className="adm3-dd__chev"/>:<FaChevronDown className="adm3-dd__chev"/>}
      </button>
      {open&&(
        <div className="adm3-dd__menu adm3-cat-menu">
          <div className="adm3-dd__item" onClick={()=>{onChange("All Categories");setOpen(false);}}>
            <span>All Categories</span>
            <span className={`adm3-radio ${value==="All Categories"?"adm3-radio--on":""}`}/>
          </div>
          {CATEGORY_TREE.map(({group,icon,sub})=>(
            <div key={group}>
              <div className={`adm3-cat-group ${sub.includes(value)?"adm3-cat-group--active":""}`}
                   onClick={e=>{e.stopPropagation();setExp(p=>({...p,[group]:!p[group]}));}}>
                <span className="adm3-cat-group__icon">{icon}</span>
                <span className="adm3-cat-group__lbl">{group}</span>
                <span className="adm3-cat-group__arr">{exp[group]?<FaChevronDown style={{fontSize:10}}/>:<FaChevronRight style={{fontSize:10}}/>}</span>
              </div>
              {exp[group]&&(
                <div className="adm3-cat-subs">
                  {sub.map(s=>(
                    <div key={s} className="adm3-cat-sub" onClick={()=>{onChange(s);setOpen(false);}}>
                      <span>{s}</span>
                      <span className={`adm3-radio ${value===s?"adm3-radio--on":""}`}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Action button logic ─── */
const MeetingActionBtn = ({meeting, onJoin}) => {
  if(meeting.status==="Ongoing") return (
    <button className="adm3-action-btn adm3-action-btn--join" onClick={()=>onJoin(meeting)}>
      <FaVideo style={{marginRight:6}}/> Join Meeting
    </button>
  );
  if(meeting.status==="Upcoming") return (
    <button className="adm3-action-btn adm3-action-btn--prejoin" onClick={()=>onJoin(meeting)}>
      Pre-Join
    </button>
  );
  if(meeting.status==="Missed"||meeting.status==="Completed") return (
    <button className="adm3-action-btn adm3-action-btn--recording">
      View Recording
    </button>
  );
  return <span className="adm3-action-dash">—</span>;
};

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
const AdminMeetings = () => {
  const navigate = useNavigate();
  const [search,        setSearch]        = useState("");
  const [meetings,      setMeetings]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filterStatus,  setFilterStatus]  = useState("All Statuses");
  const [filterCat,     setFilterCat]     = useState("All Categories");
  const [filterInvite,  setFilterInvite]  = useState("All Type");
  const [page,          setPage]          = useState(1);
  const [rowsPerPage,   setRowsPerPage]   = useState(10);
  const [activeSession, setActiveSession] = useState(null); // meeting being joined

  const fetchMeetings = useCallback(async()=>{
    setLoading(true);
    try {
      const res = await api.get("/meetings/all");
      const raw = res.data.meetings||[];
      // map backend shape to local shape
      setMeetings(raw.map(m=>({
        _id:          m._id,
        meetingId:    `#${m._id?.slice(-4)||"0000"}`,
        caseId:       m.caseId?.caseId||"—",
        meetingTitle: m.caseId?.caseTitle||m.meetingTitle||"—",
        petitioner:   m.participants?.find(p=>p.role==="Petitioner")?.name||"—",
        respondent:   m.participants?.find(p=>p.role==="Respondent")?.name||"—",
        mediator:     m.mediator?.name||m.mediator?.fullName||"—",
        status:       m.status||"Upcoming",
        invitation:   "Invited",
        scheduledDate:m.scheduledDate,
        startTime:    m.startTime,
        endTime:      m.endTime,
        virtualMeeting:m.virtualMeeting,
        caseType:     "—",
      })));
    } catch {
      setMeetings(MOCK);
    } finally { setLoading(false); }
  },[]);

  useEffect(()=>{
    if(!localStorage.getItem("token")){navigate("/login");return;}
    fetchMeetings();
  },[navigate,fetchMeetings]);

  /* filter */
  const filtered = meetings.filter(m=>{
    const q=search.toLowerCase();
    const ms=!search||m.meetingId.toLowerCase().includes(q)||m.caseId.toLowerCase().includes(q)||m.meetingTitle.toLowerCase().includes(q)||m.mediator.toLowerCase().includes(q)||m.petitioner.toLowerCase().includes(q);
    const mSt = filterStatus==="All Statuses"||m.status===filterStatus;
    const mCat= filterCat==="All Categories"||m.caseType===filterCat;
    const mInv= filterInvite==="All Type"||m.invitation===filterInvite;
    return ms&&mSt&&mCat&&mInv;
  });

  const activeFilters=[];
  if(filterCat!=="All Categories")   activeFilters.push({key:"cat",  label:filterCat,    clear:()=>setFilterCat("All Categories")});
  if(filterStatus!=="All Statuses")  activeFilters.push({key:"st",   label:filterStatus, clear:()=>setFilterStatus("All Statuses")});
  if(filterInvite!=="All Type")      activeFilters.push({key:"inv",  label:filterInvite, clear:()=>setFilterInvite("All Type")});

  const totalPages = Math.max(1,Math.ceil(filtered.length/rowsPerPage));
  const paginated  = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);

  const handleJoin = (meeting) => {
    // if has a real link open it, else show in-app video UI
    if(meeting.virtualMeeting?.meetingLink) {
      window.open(meeting.virtualMeeting.meetingLink,"_blank");
    } else {
      setActiveSession(meeting);
    }
  };

  if(activeSession) return <MeetingRoom meeting={activeSession} onLeave={()=>setActiveSession(null)}/>;

  return (
    <div className="adm3-root">
      <AdminSidebar/>

      <main className="adm3-main">
        {/* Topbar */}
        <header className="adm3-topbar">
          <div className="adm3-search">
            <FaSearch className="adm3-search__icon"/>
            <input className="adm3-search__input" placeholder="Search cases, mediators or meetings…"
              value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
          </div>
          <div className="adm3-topbar__right">
            <button className="adm3-topbar__bell"><FaBell/></button>
            <img src="https://ui-avatars.com/api/?name=Admin&background=778aff&color=fff&size=80"
              alt="admin" className="adm3-topbar__avatar"/>
          </div>
        </header>

        <div className="adm3-body">
          {/* Header */}
          <div className="adm3-page-header">
            <div>
              <h2 className="adm3-page-title">Meetings</h2>
              <p className="adm3-page-sub">Manage and monitor all mediation sessions</p>
            </div>
            <button className="adm3-refresh-btn" onClick={fetchMeetings} title="Refresh"><FaSync/></button>
          </div>

          {/* Filters */}
          <div className="adm3-filters">
            <div className="adm3-filter-group">
              <label className="adm3-filter-lbl">STATUS</label>
              <Dropdown options={STATUS_OPTIONS} value={filterStatus} onChange={v=>{setFilterStatus(v);setPage(1);}}/>
            </div>
            <div className="adm3-filter-group">
              <label className="adm3-filter-lbl">CATEGORY</label>
              <CategoryDropdown value={filterCat} onChange={v=>{setFilterCat(v);setPage(1);}}/>
            </div>
            <div className="adm3-filter-group">
              <label className="adm3-filter-lbl">INVITATION</label>
              <Dropdown options={INVITATION_OPTIONS} value={filterInvite} onChange={v=>{setFilterInvite(v);setPage(1);}}/>
            </div>
          </div>

          {/* Active tags */}
          {activeFilters.length>0&&(
            <div className="adm3-active-filters">
              <span className="adm3-active-filters__lbl">Active Filters:</span>
              {activeFilters.map(f=>(
                <span key={f.key} className="adm3-filter-tag">
                  {f.label}
                  <button className="adm3-filter-tag__x" onClick={f.clear}>×</button>
                </span>
              ))}
              <button className="adm3-clear-all" onClick={()=>{setFilterStatus("All Statuses");setFilterCat("All Categories");setFilterInvite("All Type");}}>
                Clear All
              </button>
            </div>
          )}

          {/* Table */}
          <div className="adm3-table-card">
            {loading ? (
              <div className="adm3-table-empty">Loading meetings…</div>
            ) : (
              <table className="adm3-table">
                <thead>
                  <tr>
                    <th>MEETING ID</th><th>CASE ID</th><th>TOPIC</th>
                    <th>PARTICIPANTS</th><th>MEDIATOR</th>
                    <th>STATUS</th><th>INVITATION</th><th>DATE &amp; TIME</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length===0?(
                    <tr><td colSpan={9} className="adm3-table-empty">
                      {search||activeFilters.length>0?"No meetings match your filters.":"No meetings found."}
                    </td></tr>
                  ):paginated.map(m=>(
                    <tr key={m._id}>
                      <td className="adm3-table__mid">{m.meetingId}</td>
                      <td className="adm3-table__cid">{m.caseId}</td>
                      <td>{m.meetingTitle}</td>
                      <td className="adm3-table__participants">
                        <span className="adm3-p-role">(Petitioner)</span>
                        <span className="adm3-p-name">{m.petitioner}</span>
                        <span className="adm3-p-role">(Respondent)</span>
                        <span className="adm3-p-name">{m.respondent}</span>
                      </td>
                      <td>{m.mediator}</td>
                      <td>
                        <span className="adm3-status-cell">
                          <span className={`adm3-dot ${getStatusDot(m.status)}`}/>
                          {m.status}
                        </span>
                      </td>
                      <td>{m.invitation}</td>
                      <td className="adm3-table__dt">
                        <span className="adm3-dt-date">{fmtDate(m.scheduledDate)}</span>
                        <span className="adm3-dt-time">{fmt12(m.startTime)} – {fmt12(m.endTime)}</span>
                      </td>
                      <td><MeetingActionBtn meeting={m} onJoin={handleJoin}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <div className="adm3-pagination">
              <div className="adm3-pagination__left">
                <span className="adm3-pagination__lbl">Rows per page:</span>
                <Dropdown options={ROWS_OPTIONS.map(String)} value={String(rowsPerPage)}
                  onChange={v=>{setRowsPerPage(Number(v));setPage(1);}}/>
              </div>
              <div className="adm3-pagination__right">
                <span className="adm3-pagination__info">
                  {filtered.length===0?"0":`${(page-1)*rowsPerPage+1}–${Math.min(page*rowsPerPage,filtered.length)}`} of {filtered.length} Meetings
                </span>
                <button className="adm3-pagination__btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}><FaChevronLeft/></button>
                <button className="adm3-pagination__btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}><FaChevronRight/></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ══════════════════════════════════════════
   IN-APP MEETING ROOM
   Shown when no external link is available
══════════════════════════════════════════ */
const MeetingRoom = ({meeting, onLeave}) => {
  const [muted,      setMuted]      = useState(false);
  const [camOff,     setCamOff]     = useState(false);
  const [recording,  setRecording]  = useState(true);
  const [elapsed,    setElapsed]    = useState(0);
  const [panel,      setPanel]      = useState(null); // "chat"|"notes"|"docs"|null
  const [chatMsg,    setChatMsg]    = useState("");
  const [chatLog,    setChatLog]    = useState([{from:"System",text:"Meeting started",ts:new Date()}]);
  const [notes,      setNotes]      = useState("");

  /* live timer */
  useEffect(()=>{ const id=setInterval(()=>setElapsed(e=>e+1),1000); return()=>clearInterval(id); },[]);
  const fmtElapsed = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor(s%3600/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const sendChat = () => {
    if(!chatMsg.trim()) return;
    setChatLog(l=>[...l,{from:"Admin",text:chatMsg,ts:new Date()}]);
    setChatMsg("");
  };

  /* fake participant tiles */
  const tiles = [
    {name:"Rajesh Sharma",role:"Mediator",  host:true,  color:"#3a4299"},
    {name:`${meeting.petitioner||"Petitioner"}`, role:"Petitioner", host:false, color:"#2a7a5a"},
    {name:`${meeting.respondent||"Respondent"}`, role:"Respondent", host:false, color:"#7a3a3a"},
  ];

  return (
    <div className="adm3-room">
      {/* Topbar */}
      <div className="adm3-room__topbar">
        <div className="adm3-room__title-wrap">
          <span className="adm3-room__title">{meeting.meetingTitle} | {meeting.meetingId}</span>
          {recording&&<span className="adm3-room__rec"><span className="adm3-room__rec-dot"/>RECORDING</span>}
        </div>
        <div className="adm3-room__timer">
          <span className="adm3-room__timer-dot"/>
          {fmtElapsed(elapsed)}
        </div>
      </div>

      <div className="adm3-room__body">
        {/* Main video area */}
        <div className="adm3-room__videos">
          {/* Host / featured tile */}
          <div className="adm3-room__tile adm3-room__tile--main">
            <div className="adm3-room__tile-bg" style={{background:`linear-gradient(135deg,${tiles[0].color}88,${tiles[0].color}44)`}}>
              <div className="adm3-room__avatar-placeholder" style={{background:tiles[0].color}}>
                {tiles[0].name[0]}
              </div>
            </div>
            <div className="adm3-room__name-tag">
              <span className="adm3-room__mic-icon">{muted?"🔇":"🎤"}</span>
              {tiles[0].name} ({tiles[0].role})
            </div>
            {tiles[0].host&&<span className="adm3-room__host-badge">HOST</span>}
          </div>

          {/* Secondary tiles */}
          <div className="adm3-room__tile-col">
            {tiles.slice(1).map((t,i)=>(
              <div key={i} className="adm3-room__tile adm3-room__tile--side">
                <div className="adm3-room__tile-bg" style={{background:`linear-gradient(135deg,${t.color}66,${t.color}22)`}}>
                  <div className="adm3-room__avatar-placeholder adm3-room__avatar-placeholder--sm" style={{background:t.color}}>
                    {t.name[0]}
                  </div>
                </div>
                <div className="adm3-room__name-tag">
                  <span className="adm3-room__mic-icon">🎤</span>
                  {t.name} ({t.role})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        {panel&&(
          <div className="adm3-room__panel">
            <div className="adm3-room__panel-header">
              <span>{panel==="chat"?"Meeting Chat":panel==="notes"?"Notes":"Documents"}</span>
              <button className="adm3-room__panel-close" onClick={()=>setPanel(null)}>✕</button>
            </div>

            {panel==="chat"&&(
              <>
                <div className="adm3-room__chat-log">
                  {chatLog.map((c,i)=>(
                    <div key={i} className="adm3-room__chat-msg">
                      <span className="adm3-room__chat-from">{c.from}</span>
                      <span className="adm3-room__chat-text">{c.text}</span>
                      <span className="adm3-room__chat-ts">{c.ts.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                  ))}
                </div>
                <div className="adm3-room__chat-input-row">
                  <input className="adm3-room__chat-input" placeholder="Type a message…" value={chatMsg}
                    onChange={e=>setChatMsg(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&sendChat()}/>
                  <button className="adm3-room__chat-send" onClick={sendChat}>Send</button>
                </div>
              </>
            )}

            {panel==="notes"&&(
              <textarea className="adm3-room__notes" placeholder="Take session notes here…"
                value={notes} onChange={e=>setNotes(e.target.value)}/>
            )}

            {panel==="docs"&&(
              <div className="adm3-room__docs-empty">
                <span>📄</span>
                <p>No documents shared yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Right icon rail */}
        <div className="adm3-room__rail">
          {[
            {id:"chat",  icon:"💬", label:"MEETING CHAT"},
            {id:"notes", icon:"📝", label:"NOTES"},
            {id:"docs",  icon:"📁", label:"DOCUMENTS"},
          ].map(b=>(
            <button key={b.id} className={`adm3-room__rail-btn ${panel===b.id?"active":""}`}
              onClick={()=>setPanel(panel===b.id?null:b.id)}>
              <span className="adm3-room__rail-icon">{b.icon}</span>
              <span className="adm3-room__rail-label">{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls bar */}
      <div className="adm3-room__controls">
        <button className={`adm3-ctrl-btn ${muted?"adm3-ctrl-btn--active":""}`} onClick={()=>setMuted(p=>!p)}>
          <span className="adm3-ctrl-icon">🎤</span>
          <span className="adm3-ctrl-lbl">{muted?"UNMUTE":"MUTE"}</span>
        </button>
        <button className={`adm3-ctrl-btn ${camOff?"adm3-ctrl-btn--active":""}`} onClick={()=>setCamOff(p=>!p)}>
          <span className="adm3-ctrl-icon">📷</span>
          <span className="adm3-ctrl-lbl">CAMERA</span>
        </button>
        <button className="adm3-ctrl-btn">
          <span className="adm3-ctrl-icon">📤</span>
          <span className="adm3-ctrl-lbl">SHARE</span>
        </button>
        <button className={`adm3-ctrl-btn ${recording?"adm3-ctrl-btn--record-on":""}`} onClick={()=>setRecording(p=>!p)}>
          <span className="adm3-ctrl-icon">⏺</span>
          <span className="adm3-ctrl-lbl">RECORD</span>
        </button>
        <button className="adm3-ctrl-btn">
          <span className="adm3-ctrl-icon">👥</span>
          <span className="adm3-ctrl-lbl">PARTICIPANTS</span>
        </button>
        <button className="adm3-ctrl-btn adm3-ctrl-btn--end" onClick={onLeave}>
          <span className="adm3-ctrl-icon">📵</span>
          <span className="adm3-ctrl-lbl">END</span>
        </button>
      </div>
    </div>
  );
};

export default AdminMeetings;