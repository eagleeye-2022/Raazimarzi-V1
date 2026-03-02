import React from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import ActiveIcon from "../assets/icons/active.png";
import CurrentIcon from "../assets/icons/current.png";
import TotalIcon from "../assets/icons/total.png";
import HomeIcon from "../assets/icons/home.png";
import CaseIcon from "../assets/icons/newcase.png";
import MeetingIcon from "../assets/icons/meeting.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";

import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { FaCog, FaBell } from "react-icons/fa";

Chart.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
const navigate = useNavigate();
  const phaseChart = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#6b5bff", "#eee"],
        borderWidth: 0,
      },
    ],
  };

  const paymentChart = {
    labels: ["Paid", "Remaining"],
    datasets: [
      {
        data: [100, 0],
        backgroundColor: ["#30c48d", "#eee"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Dashboard</h2>

        <nav className="admin-menu">
          <div className="admin-menu-item active" onClick={() => navigate("/admin/dashboard")}>
            <img src={HomeIcon} alt="Home" />
            <span>Home</span>
          </div>
        <div className="menu-item " onClick={() => navigate("/admin/new-cases")}>
            <img src={CaseIcon} alt="New Cases" />
            <span>New Cases</span>
          </div>
          <div className="admin-menu-item"  onClick={() => navigate("/admin/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" />
            <span>Case Meetings</span>
          </div>

          <div className="admin-menu-item"  onClick={() => navigate("/admin/chats")}>
            <img src={ChatIcon} alt="Chats" />
            <span>Chats</span>
          </div>

          <div className="admin-menu-item"  onClick={() => navigate("/admin/payment")}>
            <img src={PaymentIcon} alt="Payment" />
            <span>Payment</span>
          </div>

          <div className="admin-menu-item"  onClick={() => navigate("/admin/support")}>
            <img src={SupportIcon} alt="Support" />
            <span>Support</span>
          </div>
        </nav>

        <div className="admin-logout">
          <div className="admin-menu-item">
            <img src={LogoutIcon} alt="Logout" />
            <span>Log out</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* Navbar */}
        <header className="admin-navbar">
          <div></div>
          <div className="admin-nav-icons">
            <FaCog className="admin-icon" />
            <FaBell className="admin-icon" />
            <div className="admin-profile">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="admin-profile-img"
              />
              <span>Rohan Singhania</span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="admin-stats">
          <div className="admin-stat-card admin-green">
            <div className="admin-stat-left">
              <p className="admin-stat-label">Active Case</p>
              <h2 className="admin-stat-value">04</h2>
            </div>
            <div className="admin-stat-right">
              <img src={ActiveIcon} alt="Active Case" className="admin-stat-icon" />
            </div>
          </div>

          <div className="admin-stat-card admin-blue">
            <div className="admin-stat-left">
              <p className="admin-stat-label">Current Cases</p>
              <h2 className="admin-stat-value">02</h2>
            </div>
            <div className="admin-stat-right">
              <img src={CurrentIcon} alt="Current Cases" className="admin-stat-icon" />
            </div>
          </div>

          <div className="admin-stat-card admin-yellow">
            <div className="admin-stat-left">
              <p className="admin-stat-label">Total Case</p>
              <h2 className="admin-stat-value">06</h2>
            </div>
            <div className="admin-stat-right">
              <img src={TotalIcon} alt="Total Case" className="admin-stat-icon" />
            </div>
          </div>

          <div className="admin-stat-card admin-purple">
            <div className="admin-stat-left">
              <p className="admin-stat-label">Progress : #1234</p>
              <h2 className="admin-stat-value">+66%</h2>
            </div>
            <div className="admin-stat-right">
              <img src={ActiveIcon} alt="Progress" className="admin-stat-icon" />
            </div>
          </div>
        </section>

        {/* New Cases */}
        <section className="admin-new-cases">
          <div className="admin-section-header">
            <h3>New Cases (Oct 2025)</h3>
            <button>View all</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Party 1</th>
                <th>Party 2</th>
                <th>Category</th>
                <th>Assigned to</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#3201</td>
                <td>Property Dispute</td>
                <td>Mohan Das</td>
                <td>Ravi Gupta</td>
                <td>Property Dispute</td>
                <td className="admin-assigned">
                  <img src="https://i.pravatar.cc/30" alt="avatar" /> Ajay Sharma
                </td>
                <td className="admin-status admin-active">Active</td>
              </tr>
              <tr>
                <td>#3202</td>
                <td>Contract Dispute</td>
                <td>Sunil Rao</td>
                <td>Ajit Mehta</td>
                <td>Business</td>
                <td className="admin-assigned">
                  <img src="https://i.pravatar.cc/31" alt="avatar" /> Priya Verma
                </td>
                <td className="admin-status admin-active">Active</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Middle Section */}
        <section className="admin-middle">
          {/* Meeting Scheduled */}
          <div className="admin-meeting-section">
            <h3 className="admin-meeting-title">Meeting Scheduled</h3>

            <div className="admin-meeting-container">
              <div className="admin-meeting-header">
                <div>
                  <p className="admin-meeting-day">Today</p>
                  <p className="admin-meeting-time">02:00pm - 03:00pm</p>
                </div>
                <span className="admin-meeting-date">Sep 02, 2025</span>
              </div>

              <div className="admin-meeting-list">
                <div className="admin-meeting-row">
                  <p><strong>Case Id:</strong> #3201</p>
                  <p><strong>Title:</strong> Property Dispute</p>
                  <p><strong>Meeting:</strong> Manager</p>
                </div>
                <div className="admin-meeting-row">
                  <p><strong>Case Id:</strong> #3202</p>
                  <p><strong>Title:</strong> Property Dispute</p>
                  <p><strong>Meeting:</strong> Manager</p>
                </div>
              </div>

              <div className="admin-meeting-footer">
                <button className="admin-join-btn">Join now</button>
              </div>
            </div>
          </div>

          {/* Case Progress */}
          <section className="admin-case-progress">
            <h3>Case Progress</h3>

            <div className="admin-case-progress-box">
              <div className="admin-progress-header">
                <input type="text" placeholder="Search by case id..." />
                <div className="admin-progress-status">
                  <span className="admin-status-label">Status:</span>
                  <span className="admin-status admin-active">Active</span>
                  <span className="admin-case-id">Case Id: #3201</span>
                </div>
              </div>

              <div className="admin-charts-row">
                <div className="admin-chart-item">
                  <div className="admin-chart-wrapper">
                    <Doughnut
                      data={phaseChart}
                      options={{
                        cutout: "75%",
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: false },
                        },
                      }}
                    />
                    <div className="admin-chart-center">
                      <p className="admin-chart-title">Phase 3</p>
                      <p className="admin-chart-subtitle">60%</p>
                    </div>
                  </div>
                </div>

                <div className="admin-chart-item">
                  <div className="admin-chart-wrapper">
                    <Doughnut
                      data={paymentChart}
                      options={{
                        cutout: "75%",
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: false },
                        },
                      }}
                    />
                    <div className="admin-chart-center">
                      <p className="admin-chart-title">Payment</p>
                      <p className="admin-chart-subtitle">₹25,000</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-case-details">
                <p><strong>Party 1:</strong> Chandan Kumar</p>
                <p><strong>Party 2:</strong> Ravi Suri</p>
                <p><strong>Mediator:</strong> Shubham Jha</p>
                <p><strong>Manager:</strong> Sanju Singh</p>
                <p><strong>Category:</strong> Property Dispute</p>
              </div>
            </div>
          </section>
        </section>

        {/* Bottom Section */}
        <section className="admin-bottom">
          <div className="admin-feedback">
            <h3>Feedback Case Id: #3201</h3>
            <div className="admin-feedback-box">
              <p><strong>Party 1:</strong> Chandan Kumar</p>
              <p className="admin-rating">⭐⭐⭐⭐⭐ Very Good</p>
              <p className="admin-feedback-text">
                It is a long established fact that a reader will be distracted by more.
              </p>
            </div>
          </div>

          <div className="admin-coming-soon">
            <h3>Coming Soon...!</h3>
            <div className="admin-coming-box">
              <p>🚧 New Features in Progress 🚧</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
