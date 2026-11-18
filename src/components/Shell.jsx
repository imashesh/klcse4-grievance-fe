import { useState } from "react";
import { LogOut, LayoutDashboard, ShieldCheck, ClipboardList, UserRound, HelpCircle } from "lucide-react";
import { ROLE_LABELS } from "../constants";
import StudentDashboard from "./StudentDashboard";
import ApproverDashboard from "./ApproverDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Shell({ currentUser, onLogout, showToast, navigate, currentPath }) {
  const [workspace, setWorkspace] = useState("deputy_hod");
  // The server re-verifies account credentials and the deletion key before any deletion.
  // Do not hide the control because a previously saved login profile lacks adminAccess.
  const isDualRole = String(currentUser.loginId).trim() === "4868" && (currentUser.role === "deputy_hod" || currentUser.role === "admin");
  const hasAdminAccess = currentUser.role === "admin" || isDualRole;
  const hasDeputyAccess = currentUser.role === "deputy_hod" || (isDualRole && currentUser.deputyHodProfile?.role === "deputy_hod");
  const deputyUser = currentUser.role === "deputy_hod" ? currentUser : currentUser.deputyHodProfile;
  const showBoth = hasAdminAccess && hasDeputyAccess;

  return (
    <div className="shell reference-shell">
      <div className="topbar reference-topbar">
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

      <div className="reference-workspace-layout">
        <aside className="reference-sidebar" aria-label="Portal navigation">
          <div className="reference-sidebar-brand"><img src="/kl_logo.svg" alt="KL"/><div><strong>KL CSE-4</strong><small>GRIEVANCE PORTAL</small></div></div>
          <div className="reference-sidebar-label">WORKSPACE</div>
          {showBoth ? <>
            <button className={`reference-sidebar-link ${workspace === "deputy_hod" ? "active" : ""}`} onClick={() => setWorkspace("deputy_hod")}><LayoutDashboard size={17}/> Deputy HOD</button>
            <button className={`reference-sidebar-link ${workspace === "admin" ? "active" : ""}`} onClick={() => setWorkspace("admin")}><ShieldCheck size={17}/> Administration</button>
          </> : <div className="reference-sidebar-link active"><LayoutDashboard size={17}/> {ROLE_LABELS[currentUser.role] || "Dashboard"}</div>}
          <div className="reference-sidebar-help"><HelpCircle size={18}/><strong>Student Support</strong><p>Manage grievances securely and track every review stage.</p></div>
          <div className="reference-sidebar-profile"><span><UserRound size={18}/></span><div><strong>{currentUser.name}</strong><small>ID: {currentUser.loginId}</small></div><button type="button" onClick={onLogout} title="Sign out" aria-label="Sign out"><LogOut size={16}/></button></div>
        </aside>
        <div className="reference-workspace-main">
      {showBoth && (
        <nav className="workspace-nav" aria-label="Dashboard workspace">
          <div className="workspace-nav-inner">
            <div className="workspace-nav-heading">
              <span className="workspace-nav-eyebrow">YOUR WORKSPACES</span>
              <span className="workspace-nav-caption">Switch between review and administration</span>
            </div>
            <div className="workspace-switcher" role="group" aria-label="Choose dashboard">
              <button type="button" className={`workspace-option ${workspace === "deputy_hod" ? "active" : ""}`}
                aria-pressed={workspace === "deputy_hod"} onClick={() => setWorkspace("deputy_hod")}>
                <LayoutDashboard size={17}/> Deputy HOD
              </button>
              <button type="button" className={`workspace-option ${workspace === "admin" ? "active" : ""}`}
                aria-pressed={workspace === "admin"} onClick={() => setWorkspace("admin")}>
                <ShieldCheck size={17}/> Administration
              </button>
            </div>
          </div>
        </nav>
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

        </div>
      </div>
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
