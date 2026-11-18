import { useState } from "react";
import { LogOut } from "lucide-react";
import { ROLE_LABELS } from "../constants";
import StudentDashboard from "./StudentDashboard";
import ApproverDashboard from "./ApproverDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Shell({ currentUser, onLogout, onSwitchToAdmin, showToast, navigate, currentPath }) {
  const [workspace, setWorkspace] = useState("admin");
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminLoginBusy, setAdminLoginBusy] = useState(false);

  function closeAdminLogin() {
    if (adminLoginBusy) return;
    setAdminLoginOpen(false);
    setAdminPassword("");
    setAdminLoginError("");
  }

  async function submitAdminLogin(event) {
    event.preventDefault();
    if (!adminPassword || adminLoginBusy) return;
    setAdminLoginBusy(true);
    setAdminLoginError("");
    try {
      await onSwitchToAdmin(adminPassword);
      setAdminLoginOpen(false);
      setAdminPassword("");
      setWorkspace("admin");
    } catch {
      setAdminLoginError("Administrator authentication failed. Please use the password for your Administrator account.");
      setAdminPassword("");
    } finally {
      setAdminLoginBusy(false);
    }
  }

  const hasDualWorkspace = currentUser.role === "admin" && currentUser.deputyHodProfile?.role === "deputy_hod";
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

      {hasDualWorkspace && (
        <div className="container" style={{display:"flex", gap:10, paddingTop:20, paddingBottom:8, flexWrap:"wrap"}}>
          <button type="button" className={`btn ${workspace === "admin" ? "btn-maroon" : "btn-ghost"}`}
            onClick={() => setWorkspace("admin")}>Admin Dashboard</button>
          <button type="button" className={`btn ${workspace === "deputy_hod" ? "btn-maroon" : "btn-ghost"}`}
            onClick={() => setWorkspace("deputy_hod")}>Deputy HOD Dashboard</button>
        </div>
      )}

      {currentUser.role === "deputy_hod" && (
        <div className="container" style={{display:"flex", gap:12, alignItems:"center", paddingTop:20, paddingBottom:10, flexWrap:"wrap"}}>
          <span style={{fontSize:13, color:"var(--slate)"}}>Currently viewing: Deputy HOD</span>
          <button type="button" className="btn btn-maroon" onClick={() => { setAdminLoginError(""); setAdminLoginOpen(true); }}>
            Open Admin Dashboard
          </button>
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
      {currentUser.role === "deputy_hod" && (
        <ApproverDashboard user={currentUser} stage="deputy_hod" canReject={true} showToast={showToast} />
      )}
      {hasDualWorkspace && workspace === "deputy_hod" && (
        <ApproverDashboard user={currentUser.deputyHodProfile} stage="deputy_hod" canReject={true} showToast={showToast} />
      )}
      {currentUser.role === "hod" && (
        <ApproverDashboard user={currentUser} stage="hod" canReject={true} showToast={showToast} />
      )}
      {currentUser.role === "admin" && (!hasDualWorkspace || workspace === "admin") && (
        <AdminDashboard user={currentUser} showToast={showToast} />
      )}

      {adminLoginOpen && currentUser.role === "deputy_hod" && (
        <div className="modal-overlay" onClick={closeAdminLogin}>
          <form className="modal-card" role="dialog" aria-modal="true" aria-label="Administrator sign in"
            style={{maxWidth:440}} onClick={event => event.stopPropagation()} onSubmit={submitAdminLogin}>
            <div className="modal-head">
              <div><h2>Open Admin Dashboard</h2></div>
              <button type="button" className="modal-close" onClick={closeAdminLogin} disabled={adminLoginBusy} aria-label="Close">×</button>
            </div>
            <div className="modal-body">
              <p style={{fontSize:13.5, lineHeight:1.6, marginBottom:18}}>
                To switch ID <b>{currentUser.loginId}</b> from Deputy HOD to Administrator,
                enter the password of the <b>Administrator</b> account.
                Deputy HOD credentials alone do not grant deletion access.
              </p>
              <div className="field">
                <label htmlFor="admin-switch-password">Administrator password</label>
                <input id="admin-switch-password" type="password" autoComplete="current-password"
                  value={adminPassword} onChange={event => setAdminPassword(event.target.value)}
                  required autoFocus />
              </div>
              {adminLoginError && <p role="alert" style={{color:"#b42318", fontSize:13, marginTop:10}}>{adminLoginError}</p>}
              <div style={{display:"flex", gap:10, marginTop:20}}>
                <button type="submit" className="btn btn-maroon" disabled={adminLoginBusy || !adminPassword}>
                  {adminLoginBusy ? "Verifying…" : "Open Admin Dashboard"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={closeAdminLogin} disabled={adminLoginBusy}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
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
