import { useState } from "react";
import { ChevronLeft, AlertCircle, GitBranch, Eye, Lock } from "lucide-react";

export default function LoginScreen({ onLogin, error, clearError, onBack }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  function submit() {
    if (!id || !password) return;
    onLogin(id, password);
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-brand">
          <div>
            <div className="brand-mark"><img src="/kl_logo.svg" alt="KL" style={{ width: 22, height: 22, borderRadius: 3 }} /> Department of CSE-4</div>
            <div className="brand-title">CSE-4 Student<br />Grievance Portal</div>
            <p className="brand-sub">A formal register for raising, routing and resolving student grievances — from faculty mentor through to Head of Department.</p>
          </div>
          <div className="brand-footer">FILE NO. CSE4/PORTAL/2026 · INTERNAL USE</div>
        </div>
        <div className="login-form-side">
          <button type="button" className="back-link" onClick={onBack}><ChevronLeft size={14} /> Back</button>
          <h2>Sign In to Portal</h2>
          <p className="hint">Enter your credentials to access the grievance system.</p>

          <div className="login-features">
            <div className="login-feature-item">
              <div className="login-feature-icon"><GitBranch size={14} /></div>
              <div>
                <div className="login-feature-title">Multi-Level Review</div>
                <div className="login-feature-desc">Faculty → Coordinator → Deputy HOD → HOD</div>
              </div>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon"><Eye size={14} /></div>
              <div>
                <div className="login-feature-title">Real-Time Tracking</div>
                <div className="login-feature-desc">Track every stage of your grievance</div>
              </div>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon"><Lock size={14} /></div>
              <div>
                <div className="login-feature-title">Secure & Confidential</div>
                <div className="login-feature-desc">Role-based access control</div>
              </div>
            </div>
          </div>

          {error && <div className="login-error"><AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {error}</div>}

          <div onKeyDown={e => { if (e.key === "Enter") submit(); }}>
            <div className="field">
              <label>Login ID</label>
              <input value={id} onChange={e => { setId(e.target.value); clearError(); }} placeholder="e.g. 2300031699" autoComplete="username" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); clearError(); }} placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button className="btn btn-primary" type="button" onClick={submit}> Sign In</button>
          </div>

          <div className="demo-creds">
            <div><b>Login help</b></div>
            <div>Everyone logs in with their own ID number — your role is detected automatically.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
