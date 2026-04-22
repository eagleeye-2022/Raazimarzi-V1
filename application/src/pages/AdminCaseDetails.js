// src/pages/AdminCaseDetails.js
// CHANGES vs original:
//   1. Import ScheduleMeetingModal
//   2. Add `showSchedule` state
//   3. Wire "Schedule Meeting" button to open the modal
//   4. Render <ScheduleMeetingModal> at bottom of JSX

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaBell, FaSearch, FaChevronRight, FaVideo,
  FaFileAlt, FaImage, FaFilePdf, FaDownload, FaEye,
  FaCheckCircle, FaClock, FaPlus,
} from "react-icons/fa";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import ScheduleMeetingModal from "../components/ScheduleMeetingModal"; // ← NEW
import "./AdminCaseDetails.css";

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const MOCK_CASE = {
  _id: "1",
  caseId: "#4357",
  caseTitle: "Commercial Lease Dispute - Retail Property",
  status: "In Mediation",
  totalClaimAmount: "₹50K - 1L",
  filedDate: "2023-10-12",
  lastActivity: "2 hours ago",
  lastActivityDetail: "Document viewed by Mediator",
  nextSession: "Oct 25, 2023",
  nextSessionTime: "10:00 AM IST",
  caseType: "Commercial Property Disputes",
  caseCategory: "Commercial",
  locationOfIncident: "Colaba, Mumbai",
  approximateDate: "10/06/2026",
  caseSummary:
    "The dispute pertains to a commercial lease agreement for a retail outlet located in Colaba, Mumbai. The claimant (A. Sharma) alleges that the respondent (M. Rahul) has failed to clear outstanding rent for a period of four months, alongside a significant maintenance fee backlog dating back to June 2025. The total claim includes late payment penalties as per the original contract terms.",
  petitioner: {
    fullName: "A. Sharma",
    role: "Petitioner",
    phone: "+91 98765 43210",
    email: "sharma@gmail.com",
    address: "B-402, Sea View Apartments, Colaba Causeway, Mumbai 400005",
    gender: "Male",
    dob: "March 14, 1988",
    avatar: "https://ui-avatars.com/api/?name=A+Sharma&background=7c8ff5&color=fff&size=80",
  },
  respondent: {
    fullName: "M. Rahul",
    role: "Respondent",
    phone: "+91 91234 56789",
    email: "rahul@gmail.com",
    address: "Penthouse, Corporate Towers, BKC G Block, Mumbai 400051",
    gender: "Male",
    dob: "August 22, 1975",
    avatar: null,
  },
  mediator: {
    fullName: "S. Mehra",
    role: "Mediator (Certified Neutral)",
    avatar: "https://ui-avatars.com/api/?name=S+Mehra&background=e8eaff&color=778aff&size=80",
  },
  timeline: [
    { id: 1, title: "Case Filed",                     date: "Oct 12, 2026", description: "Initial submission of dispute details and supporting documents.", status: "done" },
    { id: 2, title: "Respondent Accepted Case",        date: "Oct 13, 2026", description: "Digital legal notice served to M. Rahul via verified email/SMS.", status: "done" },
    { id: 3, title: "Mediator Assigned - S. Mehra",   date: "Oct 15, 2026", description: "A mediator has been assigned to guide both parties toward a resolution.", status: "done" },
    { id: 4, title: "First Mediation Session",         date: "Oct 20, 2023", description: "Joint session held. Key issues identified: Maintenance backlog & notice period.", status: "done" },
    { id: 5, title: "Upcoming: Second Mediation Session", date: "Oct 25, 2023", description: "Scheduled focus: Settlement negotiation on unpaid rent amounts.", status: "upcoming" },
  ],
  feeSummary: {
    mediationFee: 15000,
    filingPlatformFee: 150,
    estimatedTaxes: 54.64,
    totalPaid: 17500,
    pendingBalance: 0,
    allDuesCleared: true,
  },
  documents: [
    { id: 1, name: "Lease Agreement.pdf",   size: "2.4 MB", uploadedDate: "Oct 12", uploadedBy: "Petitioner",  type: "pdf" },
    { id: 2, name: "Payment Receipt.jpg",   size: "1.1 MB", uploadedDate: "Oct 12", uploadedBy: "Petitioner",  type: "image" },
    { id: 3, name: "Notice_to_Tenant.pdf", size: "450 KB", uploadedDate: "Oct 13", uploadedBy: "Respondent", type: "pdf" },
  ],
  nextMeeting: {
    label: "SCHEDULED",
    title: "Next Video Session",
    date: "Oct 25, 10:00 AM",
    focus: "Resolution terms and lease amendment finalization.",
  },
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmtDate = d =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—";

const fmtINR = n =>
  n !== undefined ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

const DocIcon = ({ type }) => {
  if (type === "image") return <FaImage className="acd-doc__icon acd-doc__icon--img" />;
  if (type === "pdf")   return <FaFilePdf className="acd-doc__icon acd-doc__icon--pdf" />;
  return <FaFileAlt className="acd-doc__icon" />;
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const AdminCaseDetails = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [caseData,      setCaseData]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [showSchedule,  setShowSchedule]  = useState(false); // ← NEW

  const fetchCase = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/cases/${id}`);
      setCaseData(res.data.case || res.data);
    } catch {
      setCaseData(MOCK_CASE);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    fetchCase();
  }, [navigate, fetchCase]);

  if (loading || !caseData) return (
    <div className="acd-root">
      <AdminSidebar />
      <div className="acd-loading">Loading case details…</div>
    </div>
  );

  const { petitioner, respondent, mediator, timeline, feeSummary, documents, nextMeeting } = caseData;

  return (
    <div className="acd-root">
      <AdminSidebar />

      <main className="acd-main">

        {/* ── Topbar ── */}
        <header className="acd-topbar">
          <div className="acd-search">
            <FaSearch className="acd-search__icon" />
            <input
              className="acd-search__input"
              placeholder="Search cases, mediators or files…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="acd-topbar__right">
            <button className="acd-topbar__bell"><FaBell /></button>
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=778aff&color=fff&size=80"
              alt="admin"
              className="acd-topbar__avatar"
            />
          </div>
        </header>

        <div className="acd-body">

          {/* ── Breadcrumb ── */}
          <div className="acd-breadcrumb">
            <span className="acd-breadcrumb__link" onClick={() => navigate("/admin/new-cases")}>
              CASES
            </span>
            <FaChevronRight className="acd-breadcrumb__sep" />
            <span className="acd-breadcrumb__current">{caseData.caseId}</span>
          </div>

          {/* ── Case Title & Actions ── */}
          <div className="acd-hero">
            <div className="acd-hero__left">
              <h1 className="acd-hero__title">{caseData.caseTitle}</h1>
              <div className="acd-hero__meta">
                <span className="acd-status-badge acd-status-badge--mediation">
                  {caseData.status}
                </span>
                <span className="acd-hero__updated">Updated {caseData.lastActivity}</span>
              </div>
            </div>
            <div className="acd-hero__actions">
              <button className="acd-action-btn acd-action-btn--outline">
                <FaSearch style={{ fontSize: 13 }} />
                Message Mediator
              </button>

              {/* ↓ CHANGED: opens modal instead of doing nothing */}
              <button
                className="acd-action-btn acd-action-btn--outline"
                onClick={() => setShowSchedule(true)}
              >
                <FaVideo style={{ fontSize: 13 }} />
                Schedule Meeting
              </button>

              <button className="acd-action-btn acd-action-btn--primary">
                <FaPlus style={{ fontSize: 12 }} />
                Upload New Document
              </button>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="acd-stats">
            <div className="acd-stat">
              <span className="acd-stat__label">TOTAL CLAIM AMOUNT</span>
              <span className="acd-stat__value">{caseData.totalClaimAmount}</span>
            </div>
            <div className="acd-stat">
              <span className="acd-stat__label">FILED DATE</span>
              <span className="acd-stat__value">{fmtDate(caseData.filedDate)}</span>
              <span className="acd-stat__sub">12 days ago</span>
            </div>
            <div className="acd-stat">
              <span className="acd-stat__label">LAST ACTIVITY</span>
              <span className="acd-stat__value acd-stat__value--lg">{caseData.lastActivity}</span>
              <span className="acd-stat__sub">{caseData.lastActivityDetail}</span>
            </div>
            <div className="acd-stat">
              <span className="acd-stat__label">NEXT SESSION</span>
              <span className="acd-stat__value acd-stat__value--accent">{caseData.nextSession}</span>
              <span className="acd-stat__sub">{caseData.nextSessionTime}</span>
            </div>
          </div>

          {/* ── Main two-col layout ── */}
          <div className="acd-layout">

            {/* LEFT COLUMN */}
            <div className="acd-col-left">

              {/* Timeline */}
              <div className="acd-card">
                <div className="acd-card__header">
                  <FaClock className="acd-card__header-icon" />
                  <h3 className="acd-card__title">Case Progression Timeline</h3>
                </div>
                <div className="acd-timeline">
                  {timeline.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`acd-timeline__item ${step.status === "upcoming" ? "acd-timeline__item--upcoming" : ""}`}
                    >
                      <div className="acd-timeline__dot-col">
                        <div className={`acd-timeline__dot ${step.status === "done" ? "acd-timeline__dot--done" : "acd-timeline__dot--upcoming"}`} />
                        {idx < timeline.length - 1 && <div className="acd-timeline__line" />}
                      </div>
                      <div className="acd-timeline__content">
                        <div className={`acd-timeline__title ${step.status === "upcoming" ? "acd-timeline__title--upcoming" : ""}`}>
                          {step.title}
                        </div>
                        <div className="acd-timeline__date">{step.date}</div>
                        <div className="acd-timeline__desc">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Participant Profiles */}
              <div className="acd-card">
                <h3 className="acd-card__title" style={{ marginBottom: 20 }}>Detailed Participant Profiles</h3>
                <div className="acd-participants">
                  {[petitioner, respondent].map(person => (
                    <div key={person.role} className="acd-participant">
                      <div className="acd-participant__header">
                        {person.avatar
                          ? <img src={person.avatar} alt={person.fullName} className="acd-participant__avatar" />
                          : <div className="acd-participant__avatar acd-participant__avatar--placeholder"><span>{person.fullName[0]}</span></div>
                        }
                        <div>
                          <div className="acd-participant__name">{person.fullName}</div>
                          <div className="acd-participant__role">{person.role.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="acd-participant__fields">
                        <div className="acd-field">
                          <span className="acd-field__label">PHONE NUMBER</span>
                          <span className="acd-field__value">{person.phone}</span>
                        </div>
                        <div className="acd-field">
                          <span className="acd-field__label">EMAIL ADDRESS</span>
                          <span className="acd-field__value">{person.email}</span>
                        </div>
                        <div className="acd-field acd-field--full">
                          <span className="acd-field__label">FULL ADDRESS</span>
                          <span className="acd-field__value">{person.address}</span>
                        </div>
                        <div className="acd-field">
                          <span className="acd-field__label">GENDER</span>
                          <span className="acd-field__value">{person.gender}</span>
                        </div>
                        <div className="acd-field">
                          <span className="acd-field__label">DATE OF BIRTH</span>
                          <span className="acd-field__value">{person.dob}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Case Summary */}
              <div className="acd-card">
                <h3 className="acd-card__title" style={{ marginBottom: 14 }}>Case Summary</h3>
                <p className="acd-summary__text">{caseData.caseSummary}</p>
                <div className="acd-summary__meta">
                  <div className="acd-field">
                    <span className="acd-field__label">LOCATION OF INCIDENT</span>
                    <span className="acd-field__value">{caseData.locationOfIncident}</span>
                  </div>
                  <div className="acd-field">
                    <span className="acd-field__label">APPROXIMATE DATE</span>
                    <span className="acd-field__value">{caseData.approximateDate}</span>
                  </div>
                </div>
              </div>

              {/* Legal Documents */}
              <div className="acd-card">
                <h3 className="acd-card__title" style={{ marginBottom: 20 }}>Legal Documents</h3>
                <div className="acd-documents">
                  {documents.map(doc => (
                    <div key={doc.id} className="acd-doc">
                      <div className="acd-doc__icon-wrap">
                        <DocIcon type={doc.type} />
                      </div>
                      <div className="acd-doc__info">
                        <div className="acd-doc__name">{doc.name}</div>
                        <div className="acd-doc__meta">{doc.size} • Uploaded {doc.uploadedDate}</div>
                        <div className="acd-doc__by">By {doc.uploadedBy}</div>
                      </div>
                      <div className="acd-doc__actions">
                        <button className="acd-doc__btn"><FaEye style={{ marginRight: 5, fontSize: 11 }} />View</button>
                        <button className="acd-doc__btn"><FaDownload style={{ marginRight: 5, fontSize: 11 }} />Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="acd-col-right">

              {/* Case Participants */}
              <div className="acd-card">
                <h3 className="acd-card__title" style={{ marginBottom: 16 }}>CASE PARTICIPANTS</h3>
                <div className="acd-case-participants">
                  {[petitioner, respondent, mediator].map(p => (
                    <div key={p.role} className="acd-case-participant">
                      {p.avatar
                        ? <img src={p.avatar} alt={p.fullName} className="acd-case-participant__avatar" />
                        : <div className="acd-case-participant__avatar acd-case-participant__avatar--ph"><span>{p.fullName[0]}</span></div>
                      }
                      <div>
                        <div className="acd-case-participant__name">{p.fullName}</div>
                        <div className={`acd-case-participant__role ${p.role.includes("Mediator") ? "acd-case-participant__role--mediator" : ""}`}>
                          {p.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Meeting Card */}
              <div className="acd-meeting-card">
                <div className="acd-meeting-card__header">
                  <span className="acd-meeting-card__badge">SCHEDULED</span>
                  <button className="acd-meeting-card__expand">⤢</button>
                </div>
                <div className="acd-meeting-card__label">{nextMeeting.title}</div>
                <div className="acd-meeting-card__date">{nextMeeting.date}</div>
                <div className="acd-meeting-card__focus">Focus: {nextMeeting.focus}</div>
                <button className="acd-meeting-card__join">
                  <FaVideo style={{ marginRight: 8 }} />
                  Join Meeting
                </button>
              </div>

              {/* Fee Summary */}
              <div className="acd-card">
                <h3 className="acd-card__title" style={{ marginBottom: 16 }}>FEE SUMMARY</h3>
                <div className="acd-fee">
                  <div className="acd-fee__row">
                    <span>Mediation Fee</span>
                    <span>{fmtINR(feeSummary.mediationFee)}</span>
                  </div>
                  <div className="acd-fee__row">
                    <span>Filing Platform Fee</span>
                    <span>{fmtINR(feeSummary.filingPlatformFee)}</span>
                  </div>
                  <div className="acd-fee__row">
                    <span>Estimated Taxes (8%)</span>
                    <span>{fmtINR(feeSummary.estimatedTaxes)}</span>
                  </div>
                  <div className="acd-fee__divider" />
                  <div className="acd-fee__row acd-fee__row--bold">
                    <span>Total Paid</span>
                    <span>{fmtINR(feeSummary.totalPaid)}</span>
                  </div>
                  <div className="acd-fee__row acd-fee__row--pending">
                    <span>Pending Balance</span>
                    <span className="acd-fee__pending-val">
                      {feeSummary.pendingBalance === 0 ? "₹0.00" : fmtINR(feeSummary.pendingBalance)}
                    </span>
                  </div>
                  {feeSummary.allDuesCleared && (
                    <div className="acd-fee__cleared">
                      <FaCheckCircle className="acd-fee__cleared-icon" />
                      ALL DUES CLEARED
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ── Schedule Meeting Modal ── */}
      <ScheduleMeetingModal
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
        caseData={caseData}
      />
    </div>
  );
};

export default AdminCaseDetails;