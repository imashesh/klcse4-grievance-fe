import { useState } from "react";
import { LogOut } from "lucide-react";
import { ROLE_LABELS } from "../constants";
import StudentDashboard from "./StudentDashboard";
import ApproverDashboard from "./ApproverDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Shell({ currentUser, onLogout, showToast, navigate, currentPath }) {
  const [workspace, setWorkspace] = useState("deputy_hod");
  const isDualRole = currentUser.loginId === "4868" && currentUser.adminAccess === true;
  const hasAdminAccess = currentUser.role === "admin" || isDualRole;
  const hasDeputyAccess = currentUser.role === "deputy_hod" || (isDualRole && currentUser.deputyHodProfile?.role === "deputy_hod");
  const deputyUser = currentUser.role === "deputy_hod" ? currentUser : currentUser.deputyHodProfile;
  const showBoth = hasAdminAccess && hasDeputyAccess;

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

      {showBoth && (
        <div className="container" style={{display:"flex", gap:10, paddingTop:20, paddingBottom:8, flexWrap:"wrap"}}>
          <button type="button" className={`btn ${workspace === "admin" ? "btn-maroon" : "btn-ghost"}`}
            onClick={() => setWorkspace("admin")}>Admin Dashboard</button>
          <button type="button" className={`btn ${workspace === "deputy_hod" ? "btn-maroon" : "btn-ghost"}`}
            onClick={() => setWorkspace("deputy_hod")}>Deputy HOD Dashboard</button>
        </div>
      )}

      {currentUser.role === "student" && (
        <StudentDashboard user={currentUser} showToast={showToast} navigate={navigate} currentPath={currentPath} />
      )}
      {currentUser.role === "faculty" && (
        <ApproverDashboard user={currentUser} stage="faculty" canReject={false} showToast={showToast} />
      )}
      {currentUser.role === "coordinator" && (
        <ApproverDashboard user={currentUser} stage="coordinator" canReject={false} showToast={showToast} />
      )}
      {hasDeputyAccess && (!showBoth || workspace === "deputy_hod") && (
        <ApproverDashboard user={deputyUser} stage="deputy_hod" canReject={true} showToast={showToast} canPermanentlyDelete={isDualRole} />
      )}
      {currentUser.role === "hod" && (
        <ApproverDashboard user={currentUser} stage="hod" canReject={true} showToast={showToast} />
      )}
      {hasAdminAccess && (!showBoth || workspace === "admin") && (
        <AdminDashboard user={currentUser} showToast={showToast} />
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
