// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CaseManagerDashboard from "./pages/CaseManagerDashboard";
import CreateCase from "./pages/CreateCase";
import UploadEvidence from "./pages/UploadEvidence";
import MyProfile from "./pages/MyProfile";
import FileNewCaseStep1 from "./pages/FileNewCaseStep1";
import FileNewCaseStep2 from "./pages/FileNewCaseStep2";
import FileNewCaseStep3 from "./pages/FileNewCaseStep3";
import UserMyCases from "./pages/UserMyCases";
import AdminNewCases from "./pages/AdminNewCases";
import AdminNewCasesNextPage from "./pages/AdminNewCasesNextPage";
import UserCaseMeetings from "./pages/UserCaseMeetings";
import UserCaseMeetingsNextPage from "./pages/UserCaseMeetingsNextPage";
import UserChats from "./pages/UserChats";
import AdminCaseMeetings from "./pages/AdminCaseMeetings";
import CaseManagerNewCases from "./pages/CaseManagerNewCases";
import CaseManagerCaseMeetings from "./pages/CaseManagerCaseMeetings";
import CaseManagerChats from "./pages/CaseManagerChats";
import MediatorDashboard from "./pages/MediatorDashboard";
import MediatorMyCases from "./pages/MediatorMyCases";
import MediatorCaseMeetings from "./pages/MediatorCaseMeetings";
import MediatorChats from "./pages/MediatorChats";
import ForgotPassword from "./pages/ForgotPassword";

// 🟢 Import CaseContext provider
import { CaseProvider } from "./context/caseContext";

function App() {
  return (
    // ✅ Add basename="/app" to handle /app subdirectory
    <Router basename="/app">
      {/* Wrap all routes inside CaseProvider */}
      <CaseProvider>
        <Routes>
          {/* Root path now maps to /app/login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/create-case" element={<CreateCase />} />
          <Route path="/user/my-profile" element={<MyProfile />} />
          <Route path="/user/file-new-case/step1" element={<FileNewCaseStep1 />} />
          <Route path="/user/file-new-case/step2" element={<FileNewCaseStep2 />} />
          <Route path="/user/file-new-case/step3" element={<FileNewCaseStep3 />} />
          <Route path="/user/my-cases" element={<UserMyCases />} />
          <Route path="/user/case-meetings" element={<UserCaseMeetings />} />
          <Route path="/user/case-meetings/call" element={<UserCaseMeetingsNextPage />} />
          <Route path="/user/chats" element={<UserChats />} />

          {/* Mediator Routes */}
          <Route path="/mediator/dashboard" element={<MediatorDashboard />} />
          <Route path="/mediator/case-meetings" element={<MediatorCaseMeetings />} />
          <Route path="/mediator/chats" element={<MediatorChats />} />
          <Route path="/mediator/my-cases" element={<MediatorMyCases />} />

          {/* Case Manager Routes */}
          <Route path="/cm/dashboard" element={<CaseManagerDashboard />} />
          <Route path="/cm/new-cases" element={<CaseManagerNewCases />} />
          <Route path="/cm/case-meetings" element={<CaseManagerCaseMeetings />} />
          <Route path="/cm/chats" element={<CaseManagerChats />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/new-cases" element={<AdminNewCases />} />
          <Route path="/admin/new-cases-next-page" element={<AdminNewCasesNextPage />} />
          <Route path="/admin/case-meetings" element={<AdminCaseMeetings />} />   
        </Routes>
      </CaseProvider>
    </Router>
  );
}

export default App;