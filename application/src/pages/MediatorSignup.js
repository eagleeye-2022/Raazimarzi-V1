// import React, { useState, useRef } from "react";
// import "./MediatorSignup.css";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";

// const EXPERTISE_OPTIONS = ["Family", "Property", "Banking", "Consumer", "Employment", "Corporate", "Insurance"];

// const MediatorSignup = () => {
//   const navigate = useNavigate();
//   const idProofRef = useRef();
//   const certRef = useRef();

//   const [form, setForm] = useState({
//     name: "", email: "", phone: "", password: "",
//     qualification: "", experience: "",
//     expertise: [],
//     bio: "",
//     certifyInfo: false,
//     agreeTerms: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [idProofFile, setIdProofFile] = useState(null);
//   const [certFile, setCertFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
//     setError("");
//   };

//   const toggleExpertise = (val) => {
//     setForm(f => ({
//       ...f,
//       expertise: f.expertise.includes(val)
//         ? f.expertise.filter(x => x !== val)
//         : [...f.expertise, val]
//     }));
//   };

//   const handleDrop = (setter) => (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) setter(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.certifyInfo || !form.agreeTerms) { setError("Please check both declaration checkboxes."); return; }
//     setLoading(true); setError("");
//     try {
//       const data = new FormData();
//       Object.entries(form).forEach(([k, v]) => {
//         if (k === "expertise") data.append(k, JSON.stringify(v));
//         else data.append(k, v);
//       });
//       data.append("role", "mediator");
//       if (idProofFile) data.append("idProof", idProofFile);
//       if (certFile) data.append("certification", certFile);
//       await api.post("/auth/mediator-signup", data, { headers: { "Content-Type": "multipart/form-data" } });
//       setSubmitted(true);
//     } catch (err) {
//       setError(err.response?.data?.message || "Submission failed. Please try again.");
//     } finally { setLoading(false); }
//   };

//   if (submitted) {
//     return (
//       <div className="ms-wrapper">
//         <div className="ms-submitted-card">
//           <div className="ms-submitted-icon">
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
//           </div>
//           <h2>Application Submitted</h2>
//           <p>Your application is under review. We will notify you once it is approved.</p>
//           <button className="auth-btn" onClick={() => navigate("/")}>Back to Home</button>
//           <div className="ms-progress-track">
//             <div className="ms-progress-step completed">
//               <div className="ms-step-circle">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
//               </div>
//               <span>APPLIED</span>
//             </div>
//             <div className="ms-progress-line active" />
//             <div className="ms-progress-step active">
//               <div className="ms-step-circle"><span /></div>
//               <span>REVIEW</span>
//             </div>
//             <div className="ms-progress-line" />
//             <div className="ms-progress-step">
//               <div className="ms-step-circle"><span /></div>
//               <span>VERIFIED</span>
//             </div>
//           </div>
//           <div className="ms-next-info">
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
//             <div>
//               <strong>What happens next?</strong>
//               <p>Our compliance team typically reviews mediator applications within 3-5 business days. You'll receive an email confirmation at your registered address.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="ms-wrapper">
//       {/* TOP NAV */}
//       <nav className="ms-nav">
//         <div className="ms-nav-logo">
//           <img src="/assets/icons/logo.png" alt="RaaziMarzi" />
//         </div>
//         <Link to="/signup" className="ms-nav-back">
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
//           Back to user signup
//         </Link>
//       </nav>

//       {/* HERO BANNER */}
//       <div className="ms-hero">
//         <div className="ms-hero-image">
//           <img src="/assets/images/login-bg.png" alt="Mediation" />
//           <div className="ms-hero-overlay" />
//         </div>
//         <div className="ms-hero-text">
//           <h1>Apply as Mediator</h1>
//           <p>Join our network of verified mediators and help resolve disputes efficiently with empathy and expertise.</p>
//         </div>
//       </div>

//       {/* FORM CARD */}
//       <div className="ms-card">
//         {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

//         <form onSubmit={handleSubmit}>
//           {/* Personal Details */}
//           <div className="ms-section">
//             <h3 className="ms-section-title">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>
//               Personal Details
//             </h3>
//             <div className="ms-grid-2">
//               <div className="form-group">
//                 <label>Full Name</label>
//                 <div className="input-wrap">
//                   <input name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} required />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Email Address</label>
//                 <div className="input-wrap">
//                   <input type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Phone Number</label>
//                 <div className="input-wrap has-prefix">
//                   <span className="input-icon">
//                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 18a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2 3.18 2 2 0 0 1 3.96 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
//                   </span>
//                   <span className="phone-prefix">+91 |</span>
//                   <input name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange} required />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Password</label>
//                 <div className="input-wrap">
//                   <span className="input-icon">
//                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
//                   </span>
//                   <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
//                   <span className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
//                     {showPassword
//                       ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
//                       : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Professional Details */}
//           <div className="ms-section">
//             <h3 className="ms-section-title">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
//               Professional Details
//             </h3>
//             <div className="ms-grid-2">
//               <div className="form-group">
//                 <label>Qualification</label>
//                 <div className="input-wrap">
//                   <input name="qualification" placeholder="LL.M. in Dispute Resolution" value={form.qualification} onChange={handleChange} required />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Years of Experience</label>
//                 <div className="input-wrap">
//                   <input name="experience" placeholder="Enter experience" type="number" min="0" value={form.experience} onChange={handleChange} required />
//                 </div>
//               </div>
//             </div>
//             <div className="form-group" style={{ marginTop: 16 }}>
//               <label>Areas of Expertise</label>
//               <div className="ms-expertise-row">
//                 {EXPERTISE_OPTIONS.map(opt => (
//                   <button
//                     key={opt} type="button"
//                     className={`ms-expertise-chip${form.expertise.includes(opt) ? " selected" : ""}`}
//                     onClick={() => toggleExpertise(opt)}
//                   >
//                     <span className="ms-chip-check">
//                       {form.expertise.includes(opt)
//                         ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
//                         : <span className="ms-chip-empty" />}
//                     </span>
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Document Verification */}
//           <div className="ms-section">
//             <h3 className="ms-section-title">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
//               Document Verification
//             </h3>
//             <div className="ms-grid-2">
//               <div className="form-group">
//                 <label>ID Proof (Passport/National ID)</label>
//                 <div
//                   className={`ms-dropzone${idProofFile ? " has-file" : ""}`}
//                   onClick={() => idProofRef.current.click()}
//                   onDrop={handleDrop(setIdProofFile)}
//                   onDragOver={e => e.preventDefault()}
//                 >
//                   <input ref={idProofRef} type="file" accept=".pdf,.png,.jpg,.jpeg" hidden onChange={e => setIdProofFile(e.target.files[0])} />
//                   {idProofFile ? (
//                     <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12" /></svg><span>{idProofFile.name}</span></>
//                   ) : (
//                     <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg><p>Drag or <span className="ms-browse">browse</span></p><small>PDF, PNG (MAX 5MB)</small></>
//                   )}
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Certification</label>
//                 <div
//                   className={`ms-dropzone${certFile ? " has-file" : ""}`}
//                   onClick={() => certRef.current.click()}
//                   onDrop={handleDrop(setCertFile)}
//                   onDragOver={e => e.preventDefault()}
//                 >
//                   <input ref={certRef} type="file" accept=".pdf" hidden onChange={e => setCertFile(e.target.files[0])} />
//                   {certFile ? (
//                     <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12" /></svg><span>{certFile.name}</span></>
//                   ) : (
//                     <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg><p>Drag or <span className="ms-browse">browse</span></p><small>PDF ONLY (MAX 10MB)</small></>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Additional Information */}
//           <div className="ms-section">
//             <h3 className="ms-section-title">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
//               Additional Information
//             </h3>
//             <div className="form-group">
//               <label>Short Bio</label>
//               <textarea
//                 name="bio" rows={5}
//                 placeholder="Briefly describe your mediation approach and notable achievements..."
//                 value={form.bio} onChange={handleChange}
//                 className="ms-textarea"
//               />
//             </div>
//           </div>

//           {/* Declarations */}
//           <div className="ms-declarations">
//             <label className="ms-declare-label">
//               <input type="checkbox" name="certifyInfo" checked={form.certifyInfo} onChange={handleChange} />
//               <span className="ms-declare-check" />
//               I certify that all the information provided above is accurate and I am authorized to practice mediation.
//             </label>
//             <label className="ms-declare-label">
//               <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} />
//               <span className="ms-declare-check" />
//               I have read and agree to the <a href="/terms" className="auth-link">Terms of Service</a> and <a href="/privacy" className="auth-link">Privacy Policy</a>.
//             </label>
//           </div>

//           {/* Actions */}
//           <div className="ms-actions">
//             <button type="button" className="ms-cancel-btn" onClick={() => navigate("/signup")}>Cancel</button>
//             <button type="submit" className="auth-btn ms-submit-btn" disabled={loading}>
//               {loading ? <span className="btn-loader" /> : "Submit Application"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MediatorSignup;