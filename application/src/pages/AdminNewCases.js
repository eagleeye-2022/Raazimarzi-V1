// src/pages/AdminNewCases.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell, FaSearch, FaDownload, FaSync,
  FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp,
  FaUser, FaShoppingBag, FaBuilding,
} from "react-icons/fa";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminNewCases.css";

/* ─────────────────────────────────────────
   CATEGORY TREE
───────────────────────────────────────── */
const CATEGORY_TREE = [
  {
    group: "Individual",
    icon: <FaUser />,
    sub: [
      "Property & Rental Disputes",
      "Family Disputes",
      "Neighbour & Community",
    ],
  },
  {
    group: "Consumer",
    icon: <FaShoppingBag />,
    sub: [
      "Product Complaints",
      "Service Complaints",
      "Delivery Issues",
      "Refund & Billing Disputes",
    ],
  },
  {
    group: "Commercial",
    icon: <FaBuilding />,
    sub: [
      "Trade & Business Disputes",
      "Finance & Banking Disputes",
      "Corporate & Business Agreement Disputes",
      "Construction & Infrastructure Disputes",
      "Commercial Property Disputes",
      "Intellectual Property Disputes",
      "Technology & Digital Disputes",
      "Franchise & Distribution Disputes",
      "Employment & Workforce Disputes",
      "Contract & Agreement Disputes",
    ],
  },
];

const ALL_SUBS = CATEGORY_TREE.flatMap(g => g.sub);

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const STATUS_OPTIONS   = ["All Statuses", "Pending Review", "Mediation", "Rejected", "Resolved", "Closed"];
const MEDIATOR_OPTIONS = ["All Status", "Assigned", "Unassigned"];
const AMOUNT_OPTIONS   = ["All Ranges", "₹499 /-", "₹999 /-", "₹1499 /-", "₹1999 /-", "₹2499 /-"];
const ROWS_OPTIONS     = [5, 10, 20, 50];

const getStatusClass = (s = "") => {
  const v = s.toLowerCase().replace(/\s+/g, "-");
  if (["resolved", "closed"].includes(v))        return "adx2-badge--green";
  if (["pending", "pending-review"].includes(v)) return "adx2-badge--yellow";
  if (v === "rejected")                          return "adx2-badge--red";
  if (["mediation", "assigned"].includes(v))     return "adx2-badge--blue";
  return "adx2-badge--grey";
};

const fmtDate = d =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const MOCK_CASES = Array.from({ length: 18 }, (_, i) => ({
  _id: String(i + 1),
  caseId: `#${4245 + i}`,
  caseTitle: ["Property Division", "Employment Dispute", "Consumer Complaint", "Family Dispute", "Contract Breach"][i % 5],
  petitionerDetails: { fullName: ["Rahul Sharma", "Priya Menon", "Arun Kumar", "Sunita Rao"][i % 4] },
  defendantDetails:  { fullName: ["Karthik", "Tech Corp Ltd", "Retailer Pvt", "Landlord Inc"][i % 4] },
  caseType: ALL_SUBS[i % ALL_SUBS.length],
  status: ["Pending Review", "Mediation", "Resolved", "Rejected", "Closed"][i % 5],
  mediator: i % 3 === 1 ? null : "Kumar Sangakara",
  filingFee: [499, 999, 1499, 1999, 2499][i % 5],
  createdAt: new Date(2026, 4, 12 - i).toISOString(),
}));

/* ─────────────────────────────────────────
   PLAIN DROPDOWN
───────────────────────────────────────── */
const Dropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="adx2-dropdown" ref={ref}>
      <button
        className={`adx2-dropdown__trigger ${open ? "open" : ""}`}
        onClick={() => setOpen(p => !p)}
      >
        <span>{value}</span>
        {open
          ? <FaChevronUp className="adx2-dropdown__chevron" />
          : <FaChevronDown className="adx2-dropdown__chevron" />
        }
      </button>
      {open && (
        <div className="adx2-dropdown__menu">
          {options.map(opt => (
            <div
              key={opt}
              className="adx2-dropdown__item"
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              <span>{opt}</span>
              <span className={`adx2-radio ${value === opt ? "adx2-radio--checked" : ""}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   DATE RANGE PICKER — single input, no duplicate calendar
───────────────────────────────────────── */
const DateRangePicker = ({ dateFrom, dateTo, onFromChange, onToChange }) => {
  return (
    <div className="adx2-daterange">
      <input
        type="date"
        className="adx2-date-input"
        value={dateFrom}
        onChange={e => onFromChange(e.target.value)}
        placeholder="dd/mm"
      />
      <span className="adx2-daterange__sep">—</span>
      <input
        type="date"
        className="adx2-date-input"
        value={dateTo}
        onChange={e => onToChange(e.target.value)}
        placeholder="dd/mm"
      />
    </div>
  );
};

/* ─────────────────────────────────────────
   CATEGORY DROPDOWN
───────────────────────────────────────── */
const CategoryDropdown = ({ value, onChange }) => {
  const [open, setOpen]         = useState(false);
  const [expanded, setExpanded] = useState({});
  const ref = useRef();

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggleGroup = (group, e) => {
    e.stopPropagation();
    setExpanded(p => ({ ...p, [group]: !p[group] }));
  };

  return (
    <div className="adx2-dropdown adx2-cat-dropdown" ref={ref}>
      <button
        className={`adx2-dropdown__trigger ${open ? "open" : ""}`}
        onClick={() => setOpen(p => !p)}
      >
        <span className="adx2-cat-trigger-text">{value}</span>
        {open
          ? <FaChevronUp className="adx2-dropdown__chevron" />
          : <FaChevronDown className="adx2-dropdown__chevron" />
        }
      </button>

      {open && (
        <div className="adx2-dropdown__menu adx2-cat-menu">
          <div
            className="adx2-dropdown__item"
            onClick={() => { onChange("All Categories"); setOpen(false); }}
          >
            <span>All Categories</span>
            <span className={`adx2-radio ${value === "All Categories" ? "adx2-radio--checked" : ""}`} />
          </div>

          {CATEGORY_TREE.map(({ group, icon, sub }) => {
            const isExp     = !!expanded[group];
            const grpActive = sub.includes(value);
            return (
              <div key={group}>
                <div
                  className={`adx2-cat-group ${grpActive ? "adx2-cat-group--active" : ""}`}
                  onClick={e => toggleGroup(group, e)}
                >
                  <span className="adx2-cat-group__icon">{icon}</span>
                  <span className="adx2-cat-group__label">{group}</span>
                  <span className="adx2-cat-group__arrow">
                    {isExp
                      ? <FaChevronDown style={{ fontSize: 10 }} />
                      : <FaChevronRight style={{ fontSize: 10 }} />
                    }
                  </span>
                </div>
                {isExp && (
                  <div className="adx2-cat-subs">
                    {sub.map(s => (
                      <div
                        key={s}
                        className="adx2-cat-sub-item"
                        onClick={() => { onChange(s); setOpen(false); }}
                      >
                        <span>{s}</span>
                        <span className={`adx2-radio ${value === s ? "adx2-radio--checked" : ""}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   ROWS PER PAGE DROPDOWN (compact, chevron up/down)
───────────────────────────────────────── */
const RowsDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="adx2-rows-dropdown" ref={ref}>
      <button
        className={`adx2-rows-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen(p => !p)}
      >
        <span>{value}</span>
        {open ? <FaChevronUp style={{ fontSize: 9 }} /> : <FaChevronDown style={{ fontSize: 9 }} />}
      </button>
      {open && (
        <div className="adx2-rows-menu">
          {ROWS_OPTIONS.map(opt => (
            <div
              key={opt}
              className={`adx2-rows-item ${value === opt ? "adx2-rows-item--active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const AdminAllCases = () => {
  const navigate = useNavigate();

  const [search,       setSearch]       = useState("");
  const [allCases,     setAllCases]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const [filterStatus,   setFilterStatus]   = useState("All Statuses");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterAmount,   setFilterAmount]   = useState("All Ranges");
  const [filterMediator, setFilterMediator] = useState("All Status");
  const [dateFrom,       setDateFrom]       = useState("");
  const [dateTo,         setDateTo]         = useState("");

  const [page,        setPage]        = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/cases/all");
      setAllCases(res.data.success ? (res.data.cases || []) : (res.data.cases || res.data || []));
    } catch {
      setAllCases(MOCK_CASES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    fetchCases();
  }, [navigate, fetchCases]);

  /* ── Filtering ── */
  const filtered = allCases.filter(c => {
    const q  = search.toLowerCase();
    const ms = !search ||
      c.caseId?.toLowerCase().includes(q) ||
      c.caseTitle?.toLowerCase().includes(q) ||
      c.petitionerDetails?.fullName?.toLowerCase().includes(q) ||
      c.defendantDetails?.fullName?.toLowerCase().includes(q);

    const mSt  = filterStatus   === "All Statuses"    || c.status === filterStatus;
    const mCat = filterCategory === "All Categories"  || c.caseType === filterCategory;
    const mAmt = filterAmount   === "All Ranges"      || (c.filingFee && `₹${c.filingFee} /-` === filterAmount);
    const mMed = filterMediator === "All Status"      ||
      (filterMediator === "Assigned"   && c.mediator) ||
      (filterMediator === "Unassigned" && !c.mediator);

    let mDate = true;
    if (dateFrom && c.createdAt) mDate = new Date(c.createdAt) >= new Date(dateFrom);
    if (dateTo   && c.createdAt) mDate = mDate && new Date(c.createdAt) <= new Date(dateTo);

    return ms && mSt && mCat && mAmt && mMed && mDate;
  });

  /* ── Active filter chips ── */
  const activeFilters = [];
  if (filterCategory !== "All Categories") activeFilters.push({ key: "cat", label: filterCategory, clear: () => setFilterCategory("All Categories") });
  if (filterStatus   !== "All Statuses")   activeFilters.push({ key: "st",  label: filterStatus,   clear: () => setFilterStatus("All Statuses") });
  if (filterAmount   !== "All Ranges")     activeFilters.push({ key: "amt", label: filterAmount,   clear: () => setFilterAmount("All Ranges") });
  if (filterMediator !== "All Status")     activeFilters.push({ key: "med", label: filterMediator, clear: () => setFilterMediator("All Status") });

  const clearAll = () => {
    setFilterStatus("All Statuses");
    setFilterCategory("All Categories");
    setFilterAmount("All Ranges");
    setFilterMediator("All Status");
    setDateFrom("");
    setDateTo("");
  };

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated  = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  /* ── Row selection ── */
  const toggleRow = id =>
    setSelectedRows(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const toggleAll = () =>
    setSelectedRows(selectedRows.length === paginated.length ? [] : paginated.map(c => c._id));

  /* ── Export ── */
  const exportCSV = () => {
    const rows = [["Case ID", "Title", "Petitioner", "Respondent", "Category", "Mediator", "Status", "Fee", "Filed"]];
    filtered.forEach(c => rows.push([
      c.caseId, c.caseTitle,
      c.petitionerDetails?.fullName, c.defendantDetails?.fullName,
      c.caseType, c.mediator || "—", c.status,
      c.filingFee ? `₹${c.filingFee}` : "—", fmtDate(c.createdAt),
    ]));
    const csv  = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "cases.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="adx2-root">
      <AdminSidebar />
      <div className="adx2-loading">Loading cases…</div>
    </div>
  );

  return (
    <div className="adx2-root">
      <AdminSidebar />

      <main className="adx2-main">

        {/* ── Topbar ── */}
        <header className="adx2-topbar">
          <div className="adx2-search">
            <FaSearch className="adx2-search__icon" />
            <input
              className="adx2-search__input"
              placeholder="Search cases, mediators or files…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="adx2-topbar__right">
            <button className="adx2-topbar__bell"><FaBell /></button>
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=778aff&color=fff&size=80"
              alt="admin"
              className="adx2-topbar__avatar"
            />
          </div>
        </header>

        <div className="adx2-body">

          {/* ── Page header ── */}
          <div className="adx2-page-header">
            <div>
              <h2 className="adx2-page-title">All Cases</h2>
              <p className="adx2-page-sub">Manage and track all disputes across the platform</p>
            </div>
            <div className="adx2-page-header__actions">
              <button className="adx2-refresh-btn" onClick={fetchCases} title="Refresh">
                <FaSync />
              </button>
              <button className="adx2-export-btn" onClick={exportCSV}>
                <FaDownload /> Export as CSV
              </button>
            </div>
          </div>

          {/* ── Filters ── */}
          <div className="adx2-filters">
            <div className="adx2-filter-group">
              <label className="adx2-filter-label">STATUS</label>
              <Dropdown
                options={STATUS_OPTIONS}
                value={filterStatus}
                onChange={v => { setFilterStatus(v); setPage(1); }}
              />
            </div>

            <div className="adx2-filter-group">
              <label className="adx2-filter-label">CATEGORY</label>
              <CategoryDropdown
                value={filterCategory}
                onChange={v => { setFilterCategory(v); setPage(1); }}
              />
            </div>

            <div className="adx2-filter-group">
              <label className="adx2-filter-label">AMOUNT</label>
              <Dropdown
                options={AMOUNT_OPTIONS}
                value={filterAmount}
                onChange={v => { setFilterAmount(v); setPage(1); }}
              />
            </div>

            <div className="adx2-filter-group">
              <label className="adx2-filter-label">DATE RANGE</label>
              <DateRangePicker
                dateFrom={dateFrom}
                dateTo={dateTo}
                onFromChange={v => { setDateFrom(v); setPage(1); }}
                onToChange={v => { setDateTo(v); setPage(1); }}
              />
            </div>

            <div className="adx2-filter-group">
              <label className="adx2-filter-label">MEDIATOR</label>
              <Dropdown
                options={MEDIATOR_OPTIONS}
                value={filterMediator}
                onChange={v => { setFilterMediator(v); setPage(1); }}
              />
            </div>
          </div>

          {/* ── Active filter chips ── */}
          {activeFilters.length > 0 && (
            <div className="adx2-active-filters">
              <span className="adx2-active-filters__label">Active Filters:</span>
              {activeFilters.map(f => (
                <span key={f.key} className="adx2-filter-tag">
                  {f.label}
                  <button className="adx2-filter-tag__x" onClick={f.clear}>×</button>
                </span>
              ))}
              <button className="adx2-clear-all" onClick={clearAll}>Clear All</button>
            </div>
          )}

          {/* ── Table ── */}
          <div className="adx2-table-card">
            <div className="adx2-table-wrap">
              <table className="adx2-table">
                <thead>
                  <tr>
                    <th className="adx2-table__th-num">
                      <input
                        type="checkbox"
                        className="adx2-checkbox"
                        checked={paginated.length > 0 && selectedRows.length === paginated.length}
                        onChange={toggleAll}
                      />
                    </th>
                    <th>CASE ID</th>
                    <th>TOPIC</th>
                    <th>PARTICIPANTS</th>
                    <th>MEDIATOR</th>
                    <th>STATUS</th>
                    <th>FEE (₹)</th>
                    <th>FILED DATE</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="adx2-table__empty">
                        {search || activeFilters.length > 0
                          ? "No cases match your filters."
                          : "No cases filed yet."}
                      </td>
                    </tr>
                  ) : paginated.map((c, idx) => {
                    const rowNum = (page - 1) * rowsPerPage + idx + 1;
                    const isSel  = selectedRows.includes(c._id);
                    return (
                      <tr key={c._id} className={isSel ? "adx2-table__row--selected" : ""}>
                        <td className="adx2-table__td-num">
                          <div
                            className={`adx2-row-num ${isSel ? "adx2-row-num--checked" : ""}`}
                            onClick={() => toggleRow(c._id)}
                          >
                            {isSel
                              ? <input type="checkbox" className="adx2-checkbox" checked readOnly />
                              : rowNum
                            }
                          </div>
                        </td>
                        <td className="adx2-table__caseid">{c.caseId}</td>
                        <td>{c.caseTitle || "—"}</td>
                        <td className="adx2-table__participants">
                          <span className="adx2-participant-role">(Petitioner)</span>
                          <span className="adx2-participant-name">{c.petitionerDetails?.fullName || "—"}</span>
                          <span className="adx2-participant-role">(Respondent)</span>
                          <span className="adx2-participant-name">{c.defendantDetails?.fullName || "—"}</span>
                        </td>
                        <td>{c.mediator || "—"}</td>
                        <td>
                          <span className={`adx2-badge ${getStatusClass(c.status)}`}>
                            {c.status || "Pending"}
                          </span>
                        </td>
                        <td className="adx2-table__fee">
                          {c.filingFee ? `₹${c.filingFee.toLocaleString("en-IN")} /-` : "—"}
                        </td>
                        <td>{fmtDate(c.createdAt)}</td>
                        <td>
                          <button
                            className="adx2-view-btn"
                           onClick={() => navigate("/admin/view-details")}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination footer ── */}
            <div className="adx2-pagination">
              <div className="adx2-pagination__left">
                <span className="adx2-pagination__label">Rows per page:</span>
                <RowsDropdown
                  value={rowsPerPage}
                  onChange={v => { setRowsPerPage(v); setPage(1); }}
                />
                {selectedRows.length > 0 && (
                  <span className="adx2-pagination__selected">
                    Selected row(s) - {selectedRows.length}
                  </span>
                )}
              </div>
              <div className="adx2-pagination__right">
                <span className="adx2-pagination__info">
                  {filtered.length === 0
                    ? "0"
                    : `${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, filtered.length)}`
                  } of {filtered.length} cases
                </span>
                <button
                  className="adx2-pagination__btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="adx2-pagination__btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminAllCases;