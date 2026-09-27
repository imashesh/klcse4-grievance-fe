import { LogOut } from "lucide-react";
import { ROLE_LABELS } from "../constants";
import StudentDashboard from "./StudentDashboard";
import ApproverDashboard from "./ApproverDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Shell({ currentUser, onLogout, showToast, navigate, currentPath }) {
  return (
    <div className="shell">
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-badge"><img src="/kl_logo.svg" alt="KL" className="topbar-logo"/></div>
          <div>
            <div className="topbar-title">CSE-4 Student Grievance Portal</div>
            <div className="topbar-sub">Department of Computer Science &amp; Engineering</div>
          </div>
        </div>
        <div className="topbar-right">
          <div className="who">
            <b>{currentUser.name}</b>
            <span>
              {ROLE_LABELS[currentUser.role]}
              {currentUser.batch ? ` · ${currentUser.batch}` : ""}
              {currentUser.categories ? ` · ${currentUser.categories}` : ""}
            </span>
          </div>
          <button className="logout-btn" onClick={onLogout}><LogOut size={14}/> Sign Out</button>
        </div>
      </div>

      {currentUser.role === "student" && (
        <StudentDashboard user={currentUser} showToast={showToast} navigate={navigate} currentPath={currentPath} />
      )}
      {currentUser.role === "faculty" && (
        <ApproverDashboard user={currentUser} stage="faculty" canReject={false} showToast={showToast} />
      )}
      {currentUser.role === "coordinator" && (
        <ApproverDashboard user={currentUser} stage="coordinator" canReject={false} showToast={showToast} />
      )}
      {currentUser.role === "deputy_hod" && (
        <ApproverDashboard user={currentUser} stage="deputy_hod" canReject={true} showToast={showToast} />
      )}
      {currentUser.role === "hod" && (
        <ApproverDashboard user={currentUser} stage="hod" canReject={true} showToast={showToast} />
      )}
      {currentUser.role === "admin" && (
        <AdminDashboard showToast={showToast} />
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/kl_logo.svg" alt="KL" style={{width:20, height:20, borderRadius:4}}/>
            <span>CSE-4 Student Grievance Portal</span>
          </div>
          <div className="footer-info">
            <span>Department of Computer Science & Engineering</span>
            <span className="footer-sep">·</span>
            <span>KL University</span>
            <span className="footer-sep">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
