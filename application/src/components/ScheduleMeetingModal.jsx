// src/components/ScheduleMeetingModal.js
import React, { useState, useEffect, useCallback } from "react";
import {
  FaTimes, FaVideo, FaPhone, FaCalendarAlt,
  FaUsers, FaBell, FaCog, FaPlus, FaMinus,
  FaCheckCircle, FaSpinner, FaBalanceScale,
} from "react-icons/fa";
import api from "../api/axios";

/* ─── helpers ─── */
const pad = (n) => String(n).padStart(2, "0");

const addMinutes = (timeStr, mins) => {
  const [h, m] = timeStr.split(":").map(Number);
  const total   = h * 60 + m + mins;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
};

const fmt12 = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};

const timeOptions = () => {
  const opts = [];
  for (let h = 8; h < 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      const val = `${pad(h)}:${pad(m)}`;
      opts.push({ value: val, label: fmt12(val) });
    }
  }
  return opts;
};

const DURATIONS = [
  { label: "30 min", mins: 30  },
  { label: "1 hour", mins: 60  },
  { label: "Custom", mins: null },
];

// ✅ These now exactly match the updated model enum
const MEETING_TYPES = [
  { value: "Mediation Session", label: "Mediation Session"  },
  { value: "Pre-Mediation",     label: "Pre-Mediation"      },
  { value: "Caucus",            label: "Caucus"             },
  { value: "Joint Session",     label: "Joint Session"      },
  { value: "Review Session",    label: "Review Session"     },
  { value: "Final Settlement",  label: "Final Settlement"   },
];

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function ScheduleMeetingModal({ isOpen, onClose, caseData }) {
  const [agenda,       setAgenda]       = useState("");
  const [meetingType,  setMeetingType]  = useState("Mediation Session");
  const [date,         setDate]         = useState("");
  const [startTime,    setStartTime]    = useState("10:00");
  const [durationSel,  setDurationSel]  = useState(30);
  const [customMins,   setCustomMins]   = useState(60);
  const [locationType, setLocationType] = useState("virtual");
  const [notifyEmail,  setNotifyEmail]  = useState(true);
  const [notifySMS,    setNotifySMS]    = useState(false);
  const [participants, setParticipants] = useState([]);

  const [submitting,    setSubmitting]    = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [error,         setError]         = useState("");
  const [availability,  setAvailability]  = useState(null);
  const [checkingAvail, setCheckingAvail] = useState(false);

  /* init participants from caseData */
  useEffect(() => {
    if (!caseData) return;
    const initial = [];
    // ✅ Support both petitionerDetails (your model) and petitioner (populated)
    const petName = caseData.petitionerDetails?.fullName || caseData.petitioner?.fullName;
    const resName = caseData.defendantDetails?.fullName  || caseData.respondent?.fullName;
    if (petName) initial.push({ name: petName, role: "Petitioner", included: true });
    if (resName) initial.push({ name: resName, role: "Respondent", included: true });
    setParticipants(initial);
  }, [caseData]);

  /* check availability */
  const checkAvailability = useCallback(async () => {
    if (!date || !caseData?.mediator) return;
    setCheckingAvail(true);
    try {
      const mediatorId = caseData.mediator._id || caseData.mediatorId;
      if (!mediatorId) return;
      const res = await api.get("/meetings/availability", { params: { mediatorId, date } });
      setAvailability(res.data);
    } catch {
      setAvailability(null);
    } finally {
      setCheckingAvail(false);
    }
  }, [date, caseData]);

  useEffect(() => { checkAvailability(); }, [checkAvailability]);

  const effectiveMins = durationSel === "custom" ? customMins : durationSel;
  const endTime       = addMinutes(startTime, effectiveMins);

  const toggleParticipant = (idx) =>
    setParticipants(prev => prev.map((p, i) => i === idx ? { ...p, included: !p.included } : p));

  /* ─── submit ─── */
  const handleSubmit = async () => {
    setError("");
    if (!date)          return setError("Please select a date.");
    if (!agenda.trim()) return setError("Please add an agenda.");

    setSubmitting(true);
    try {
      // ✅ meetingTitle: include case ID for clarity
      const meetingTitle = `${meetingType} – ${caseData?.caseId || caseData?.title || "Case"}`;

      // ✅ agendaItems: controller maps {title} → {item, order}
      const agendaItems = agenda
        .split("\n")
        .filter(Boolean)
        .map((text, i) => ({ title: text, duration: 0, completed: false, order: i + 1 }));

      // ✅ participants: send {name, role} — controller handles missing userId gracefully
      const participantList = participants
        .filter(p => p.included)
        .map(p => ({
          name: p.name,
          role: p.role.toLowerCase(), // "petitioner" | "respondent"
          ...(p.userId ? { userId: p.userId } : {}),
        }));

      const payload = {
        meetingTitle,
        description:   agenda,
        caseId:        caseData?._id,
        meetingType,
        scheduledDate: date,
        startTime,
        endTime,
        timezone:      "Asia/Kolkata",
        mediatorId:    caseData?.mediator?._id || caseData?.mediatorId || undefined,
        locationType,
        virtualMeeting: locationType === "virtual"
          ? { platform: "Zoom", meetingLink: "", passcode: "" }
          : undefined,
        agendaItems,
        participants:  participantList,
        notifyEmail,
        notifySMS,
      };

      await api.post("/meetings", payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2200);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to schedule meeting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const bookedCount = availability?.bookedSlots?.length ?? 0;

  return (
    <>
      <div className="smm-overlay" onClick={onClose} />

      <div className="smm-modal" role="dialog" aria-modal="true" aria-label="Schedule Meeting">

        {/* ── Success ── */}
        {success && (
          <div className="smm-success">
            <FaCheckCircle className="smm-success__icon" />
            <div className="smm-success__title">Meeting Scheduled!</div>
            <div className="smm-success__sub">All parties will be notified.</div>
          </div>
        )}

        {!success && (
          <>
            {/* Header */}
            <div className="smm-header">
              <div>
                <h2 className="smm-header__title">Schedule Meeting</h2>
                <p className="smm-header__sub">Set up a mediation session for this case</p>
              </div>
              <button className="smm-close" onClick={onClose} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            {/* Case strip */}
            <div className="smm-case-strip">
              <div className="smm-case-strip__icon"><FaBalanceScale /></div>
              <div className="smm-case-strip__fields">
                <div className="smm-case-strip__field">
                  <span className="smm-label">CASE ID</span>
                  <span className="smm-val">{caseData?.caseId || "—"}</span>
                </div>
                <div className="smm-case-strip__field">
                  <span className="smm-label">TITLE</span>
                  <span className="smm-val">
                    {(caseData?.caseTitle || caseData?.title || "—").slice(0, 32)}
                    {(caseData?.caseTitle || caseData?.title || "").length > 32 ? "…" : ""}
                  </span>
                </div>
                <div className="smm-case-strip__field">
                  <span className="smm-label">MEDIATOR</span>
                  <span className="smm-val">
                    {caseData?.mediator?.fullName || caseData?.mediator?.name || "Unassigned"}
                  </span>
                </div>
                <div className="smm-case-strip__field">
                  <span className="smm-label">PARTIES</span>
                  <span className="smm-val">
                    {[
                      caseData?.petitionerDetails?.fullName || caseData?.petitioner?.fullName,
                      caseData?.defendantDetails?.fullName  || caseData?.respondent?.fullName,
                    ].filter(Boolean).join(", ") || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="smm-body">

              {/* Meeting Type */}
              <div className="smm-section">
                <label className="smm-section__label">
                  <FaCog className="smm-section__icon" /> MEETING TYPE
                </label>
                <select className="smm-select" value={meetingType} onChange={e => setMeetingType(e.target.value)}>
                  {MEETING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Agenda */}
              <div className="smm-section">
                <label className="smm-section__label">AGENDA</label>
                <textarea
                  className="smm-textarea"
                  rows={3}
                  placeholder="Outline the primary topics (one per line)…"
                  value={agenda}
                  onChange={e => setAgenda(e.target.value)}
                />
                <span style={{ fontSize: 11, color: "#aaa" }}>Each line becomes a separate agenda item</span>
              </div>

              {/* Date & Time */}
              <div className="smm-section">
                <label className="smm-section__label">
                  <FaCalendarAlt className="smm-section__icon" /> DATE &amp; TIME
                </label>
                <div className="smm-dt-row">
                  <div className="smm-dt-field">
                    <span className="smm-dt-label">Select Date</span>
                    <input
                      type="date"
                      className="smm-input"
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>
                  <div className="smm-dt-field">
                    <span className="smm-dt-label">Start Time</span>
                    <select className="smm-select" value={startTime} onChange={e => setStartTime(e.target.value)}>
                      {timeOptions().map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Duration */}
                <div className="smm-dt-field" style={{ marginTop: 14 }}>
                  <span className="smm-dt-label">Duration</span>
                  <div className="smm-duration-row">
                    {DURATIONS.map(d => (
                      <button
                        key={d.label}
                        className={`smm-pill ${durationSel === (d.mins ?? "custom") ? "smm-pill--active" : ""}`}
                        onClick={() => setDurationSel(d.mins ?? "custom")}
                      >
                        {d.label}
                      </button>
                    ))}
                    {durationSel === "custom" && (
                      <div className="smm-custom-dur">
                        <button onClick={() => setCustomMins(m => Math.max(15, m - 15))}><FaMinus /></button>
                        <span>{customMins} min</span>
                        <button onClick={() => setCustomMins(m => Math.min(480, m + 15))}><FaPlus /></button>
                      </div>
                    )}
                  </div>
                  <div className="smm-endtime-hint">Ends at <strong>{fmt12(endTime)}</strong></div>
                </div>

                {/* Availability */}
                {date && (
                  <div className={`smm-avail ${bookedCount === 0 ? "smm-avail--free" : "smm-avail--busy"}`}>
                    {checkingAvail
                      ? <><FaSpinner className="smm-spin" /> Checking mediator availability…</>
                      : bookedCount === 0
                        ? <><FaCheckCircle /> Mediator is available on this date</>
                        : <><FaCog /> {bookedCount} session{bookedCount > 1 ? "s" : ""} booked — verify time slot</>
                    }
                  </div>
                )}
              </div>

              {/* Participants + Settings */}
              <div className="smm-two-col">
                <div className="smm-section">
                  <label className="smm-section__label">
                    <FaUsers className="smm-section__icon" /> PARTICIPANTS
                  </label>
                  <div className="smm-participants">
                    {participants.map((p, idx) => (
                      <div key={idx} className={`smm-participant ${p.included ? "" : "smm-participant--excluded"}`}>
                        <div className="smm-participant__avatar">{p.name[0]}</div>
                        <div className="smm-participant__info">
                          <span className="smm-participant__name">{p.name}</span>
                          <span className="smm-participant__role">{p.role}</span>
                        </div>
                        <button
                          className="smm-participant__toggle"
                          onClick={() => toggleParticipant(idx)}
                          title={p.included ? "Remove" : "Add"}
                        >
                          {p.included ? <FaMinus /> : <FaPlus />}
                        </button>
                      </div>
                    ))}

                    {/* Mediator (non-removable) */}
                    {(caseData?.mediator?.fullName || caseData?.mediator?.name) && (
                      <div className="smm-participant smm-participant--mediator">
                        <div className="smm-participant__avatar smm-participant__avatar--med">
                          {(caseData.mediator.fullName || caseData.mediator.name)[0]}
                        </div>
                        <div className="smm-participant__info">
                          <span className="smm-participant__name">
                            {caseData.mediator.fullName || caseData.mediator.name}
                          </span>
                          <span className="smm-participant__role smm-participant__role--med">Mediator</span>
                        </div>
                        <FaCheckCircle className="smm-participant__check" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="smm-section">
                  <label className="smm-section__label">
                    <FaCog className="smm-section__icon" /> MEETING SETTINGS
                  </label>
                  <div className="smm-loc-options">
                    <label className={`smm-loc-option ${locationType === "virtual" ? "smm-loc-option--active" : ""}`}>
                      <input
                        type="radio" name="locationType"
                        checked={locationType === "virtual"}
                        onChange={() => setLocationType("virtual")}
                      />
                      <div className="smm-loc-option__icon"><FaVideo /></div>
                      <div>
                        <div className="smm-loc-option__title">Video Call</div>
                        <div className="smm-loc-option__sub">Encrypted secure link</div>
                      </div>
                    </label>

                    <label className={`smm-loc-option ${locationType === "phone" ? "smm-loc-option--active" : ""}`}>
                      <input
                        type="radio" name="locationType"
                        checked={locationType === "phone"}
                        onChange={() => setLocationType("phone")}
                      />
                      <div className="smm-loc-option__icon"><FaPhone /></div>
                      <div>
                        <div className="smm-loc-option__title">Phone Call</div>
                        <div className="smm-loc-option__sub">Traditional dial-in</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="smm-section">
                <label className="smm-section__label">
                  <FaBell className="smm-section__icon" /> NOTIFICATIONS
                </label>
                <div className="smm-notif-row">
                  <label className="smm-radio-label">
                    <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} />
                    <span className="smm-radio-circle smm-radio-circle--check" />
                    Email invites
                  </label>
                  <label className="smm-radio-label">
                    <input type="checkbox" checked={notifySMS} onChange={e => setNotifySMS(e.target.checked)} />
                    <span className="smm-radio-circle smm-radio-circle--check" />
                    SMS reminders
                  </label>
                </div>
              </div>

              {error && <div className="smm-error">{error}</div>}
            </div>

            {/* Footer */}
            <div className="smm-footer">
              <button className="smm-btn smm-btn--cancel" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button className="smm-btn smm-btn--submit" onClick={handleSubmit} disabled={submitting}>
                {submitting
                  ? <><FaSpinner className="smm-spin" style={{ marginRight: 8 }} />Scheduling…</>
                  : <><FaVideo style={{ marginRight: 8 }} />Schedule Meeting</>
                }
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .smm-overlay {
          position: fixed; inset: 0;
          background: rgba(10, 12, 30, 0.55);
          backdrop-filter: blur(3px);
          z-index: 1000;
          animation: smm-fade-in 0.18s ease;
        }
        .smm-modal {
          position: fixed; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1001;
          width: min(700px, 96vw);
          max-height: 90vh;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 32px 80px rgba(10,12,40,0.22), 0 0 0 1px rgba(119,138,255,0.1);
          display: flex; flex-direction: column;
          overflow: hidden;
          animation: smm-slide-up 0.22s cubic-bezier(0.34,1.56,0.64,1);
          font-family: 'Inter', sans-serif;
        }
        @keyframes smm-fade-in  { from { opacity:0 } to { opacity:1 } }
        @keyframes smm-slide-up { from { opacity:0; transform:translate(-50%,-44%) } to { opacity:1; transform:translate(-50%,-50%) } }
        .smm-success { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:80px 40px; text-align:center; animation:smm-fade-in 0.3s ease; }
        .smm-success__icon  { font-size:52px; color:#22c55e; }
        .smm-success__title { font-size:22px; font-weight:800; color:#111; }
        .smm-success__sub   { font-size:14px; color:#888; }
        .smm-header { display:flex; align-items:flex-start; justify-content:space-between; padding:22px 26px 18px; border-bottom:1px solid #ebebf5; flex-shrink:0; }
        .smm-header__title { font-size:20px; font-weight:800; color:#111; margin:0 0 3px; }
        .smm-header__sub   { font-size:13px; color:#999; margin:0; }
        .smm-close { background:#f5f5fa; border:none; border-radius:8px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:#888; cursor:pointer; font-size:14px; transition:background 0.2s,color 0.2s; flex-shrink:0; }
        .smm-close:hover { background:#fee2e2; color:#b91c1c; }
        .smm-case-strip { display:flex; align-items:center; gap:14px; background:#f8f8fd; border-bottom:1px solid #ebebf5; padding:14px 26px; flex-shrink:0; }
        .smm-case-strip__icon { width:40px; height:40px; border-radius:10px; background:rgba(119,138,255,0.12); display:flex; align-items:center; justify-content:center; color:rgba(119,138,255,1); font-size:15px; flex-shrink:0; }
        .smm-case-strip__fields { display:flex; gap:28px; flex-wrap:wrap; }
        .smm-case-strip__field  { display:flex; flex-direction:column; gap:2px; }
        .smm-label { font-size:10px; font-weight:700; letter-spacing:0.07em; color:#aaa; text-transform:uppercase; }
        .smm-val   { font-size:13px; font-weight:600; color:#222; }
        .smm-body { flex:1; overflow-y:auto; padding:22px 26px; display:flex; flex-direction:column; gap:20px; }
        .smm-body::-webkit-scrollbar { width:5px; }
        .smm-body::-webkit-scrollbar-thumb { background:#e0e0ea; border-radius:99px; }
        .smm-section { display:flex; flex-direction:column; gap:10px; }
        .smm-section__label { display:flex; align-items:center; gap:7px; font-size:11px; font-weight:700; letter-spacing:0.08em; color:#333; text-transform:uppercase; }
        .smm-section__icon { color:rgba(119,138,255,1); font-size:12px; }
        .smm-two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        @media (max-width:560px) { .smm-two-col { grid-template-columns:1fr; } }
        .smm-select, .smm-input { width:100%; height:42px; padding:0 14px; border:1px solid #e4e4ee; border-radius:10px; font-size:13px; font-family:'Inter',sans-serif; color:#222; background:#fafafa; outline:none; box-sizing:border-box; transition:border-color 0.2s,box-shadow 0.2s; appearance:none; -webkit-appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23aaa' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }
        .smm-input { background-image:none; padding-right:14px; }
        .smm-select:focus, .smm-input:focus { border-color:rgba(119,138,255,0.6); box-shadow:0 0 0 3px rgba(119,138,255,0.1); background:#fff; }
        .smm-textarea { width:100%; padding:12px 14px; border:1px solid #e4e4ee; border-radius:10px; font-size:13px; font-family:'Inter',sans-serif; color:#222; background:#fafafa; outline:none; resize:vertical; box-sizing:border-box; transition:border-color 0.2s,box-shadow 0.2s; line-height:1.6; }
        .smm-textarea:focus { border-color:rgba(119,138,255,0.6); box-shadow:0 0 0 3px rgba(119,138,255,0.1); background:#fff; }
        .smm-textarea::placeholder { color:#bbb; }
        .smm-dt-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .smm-dt-field { display:flex; flex-direction:column; gap:6px; }
        .smm-dt-label { font-size:12px; color:#888; font-weight:500; }
        .smm-duration-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .smm-pill { height:36px; padding:0 18px; border:1px solid #e4e4ee; border-radius:8px; background:#fff; color:#555; font-size:13px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.18s; }
        .smm-pill:hover { border-color:rgba(119,138,255,0.5); color:rgba(119,138,255,1); }
        .smm-pill--active { background:rgba(119,138,255,1); color:#fff; border-color:rgba(119,138,255,1); }
        .smm-custom-dur { display:flex; align-items:center; gap:10px; padding:0 14px; height:36px; border:1px solid rgba(119,138,255,0.4); border-radius:8px; background:rgba(119,138,255,0.04); font-size:13px; font-weight:600; color:#444; }
        .smm-custom-dur button { background:none; border:none; cursor:pointer; color:rgba(119,138,255,1); font-size:11px; padding:0; display:flex; align-items:center; }
        .smm-endtime-hint { font-size:12px; color:#999; margin-top:4px; }
        .smm-endtime-hint strong { color:#555; }
        .smm-avail { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; padding:10px 14px; border-radius:8px; margin-top:6px; }
        .smm-avail--free { background:#dcfce7; color:#15803d; }
        .smm-avail--busy { background:#fef9c3; color:#a16207; }
        .smm-participants { display:flex; flex-direction:column; gap:8px; }
        .smm-participant { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; background:#f8f8fd; border:1px solid #ebebf5; transition:opacity 0.2s; }
        .smm-participant--excluded { opacity:0.45; }
        .smm-participant--mediator { background:rgba(119,138,255,0.06); border-color:rgba(119,138,255,0.25); }
        .smm-participant__avatar { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; background:linear-gradient(135deg,#c7d0ff,#778aff); color:#fff; }
        .smm-participant__avatar--med { background:linear-gradient(135deg,#778aff,#3b52e0); }
        .smm-participant__info { flex:1; min-width:0; }
        .smm-participant__name { font-size:13px; font-weight:600; color:#222; display:block; }
        .smm-participant__role { font-size:11px; color:#999; }
        .smm-participant__role--med { color:rgba(119,138,255,1); font-weight:600; }
        .smm-participant__toggle { background:none; border:1px solid #e0e0ea; border-radius:6px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:11px; color:#aaa; cursor:pointer; transition:all 0.18s; }
        .smm-participant__toggle:hover { border-color:rgba(119,138,255,0.5); color:rgba(119,138,255,1); }
        .smm-participant__check { color:rgba(119,138,255,1); font-size:14px; }
        .smm-loc-options { display:flex; flex-direction:column; gap:10px; }
        .smm-loc-option { display:flex; align-items:center; gap:12px; padding:12px 14px; border:1.5px solid #e4e4ee; border-radius:12px; cursor:pointer; transition:all 0.18s; position:relative; }
        .smm-loc-option input[type=radio] { position:absolute; right:14px; top:50%; transform:translateY(-50%); accent-color:rgba(119,138,255,1); width:16px; height:16px; }
        .smm-loc-option--active { border-color:rgba(119,138,255,1); background:rgba(119,138,255,0.05); }
        .smm-loc-option__icon { width:34px; height:34px; border-radius:8px; background:rgba(119,138,255,0.12); display:flex; align-items:center; justify-content:center; color:rgba(119,138,255,1); font-size:14px; }
        .smm-loc-option__title { font-size:13px; font-weight:700; color:#222; }
        .smm-loc-option__sub   { font-size:12px; color:#999; margin-top:1px; }
        .smm-notif-row { display:flex; gap:20px; flex-wrap:wrap; }
        .smm-radio-label { display:flex; align-items:center; gap:8px; font-size:13px; color:#444; cursor:pointer; user-select:none; }
        .smm-radio-label input { display:none; }
        .smm-radio-circle { width:18px; height:18px; border-radius:50%; border:2px solid #ccc; display:inline-flex; align-items:center; justify-content:center; transition:all 0.18s; flex-shrink:0; }
        .smm-radio-label input:checked + .smm-radio-circle { border-color:rgba(119,138,255,1); background:rgba(119,138,255,1); box-shadow:inset 0 0 0 3px #fff; }
        .smm-error { background:#fee2e2; color:#b91c1c; border-radius:8px; padding:10px 14px; font-size:13px; font-weight:500; }
        .smm-footer { display:flex; align-items:center; justify-content:flex-end; gap:12px; padding:16px 26px; border-top:1px solid #ebebf5; flex-shrink:0; background:#fafafa; }
        .smm-btn { display:inline-flex; align-items:center; height:42px; padding:0 22px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer; font-family:'Inter',sans-serif; border:none; transition:all 0.2s; }
        .smm-btn--cancel { background:none; color:#888; border:1px solid #e0e0ea; }
        .smm-btn--cancel:hover { background:#f5f5fa; color:#444; }
        .smm-btn--submit { background:linear-gradient(135deg,#778aff 0%,#5c6fdf 100%); color:#fff; box-shadow:0 4px 14px rgba(119,138,255,0.4); }
        .smm-btn--submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(119,138,255,0.5); }
        .smm-btn--submit:disabled { opacity:0.65; cursor:not-allowed; transform:none; }
        .smm-spin { animation:smm-rotate 0.8s linear infinite; display:inline-block; }
        @keyframes smm-rotate { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
      `}</style>
    </>
  );
}