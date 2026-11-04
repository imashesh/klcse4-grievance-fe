import { useState } from "react";
import {
  ChevronRight,
  AlertCircle,
  GitBranch,
  Lock,
  BookOpen,
} from "lucide-react";

export default function LoginScreen({ onLogin, error, clearError, onBack }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submit(event) {
    event.preventDefault();
    if (!id.trim() || !password) return;
    onLogin(id.trim(), password);
  }

  function updateId(value) {
    setId(value);
    clearError();
  }

  function updatePassword(value) {
    setPassword(value);
    clearError();
  }

  return (
    <main className="login-wrap">
      <section className="login-card" aria-label="Student Grievance Portal sign in">
        <aside className="login-brand">
          <div className="login-brand-top">
            <div className="brand-mark">
              <img src="/kl_logo.svg" alt="KL University" />
              <span>Department of CSE-4</span>
            </div>
            <div className="brand-title">Student Grievance Portal</div>
            <p className="brand-sub">
              A centralized platform for submitting student grievances, tracking
              their status, and managing the resolution process with transparency
              and accountability.
            </p>
          </div>

          <div className="brand-footer">
            KL UNIVERSITY <span>·</span> CSE-4 <span>·</span> STUDENT GRIEVANCE PORTAL
          </div>
          <div className="login-orbit login-orbit-one" />
          <div className="login-orbit login-orbit-two" />
        </aside>

        <section className="login-form-side">
          <div className="login-secure-label">
            <ChevronRight size={14} />
            <span>Secure Portal Access</span>
          </div>

          <div className="login-heading">
            <h2>Sign In to Portal</h2>
            <p>Enter your credentials to access the grievance system.</p>
          </div>

          <div className="login-features">
            <div className="login-feature-icon"><GitBranch size={17} /></div>
            <div>
              <div className="login-feature-title">Multi-Level Review</div>
              <div className="login-feature-desc">Faculty → Coordinator → Deputy HOD → HOD</div>
            </div>

            <div className="login-feature-icon"><BookOpen size={17} /></div>
            <div>
              <div className="login-feature-title">Transparent Grievance Tracking</div>
              <div className="login-feature-desc">Follow every stage of your grievance resolution</div>
            </div>

            <div className="login-feature-icon"><Lock size={17} /></div>
            <div>
              <div className="login-feature-title">Secure &amp; Confidential</div>
              <div className="login-feature-desc">Role-based access for students and staff</div>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="grievance-login-id">Login ID</label>
              <input
                id="grievance-login-id"
                value={id}
                onChange={(event) => updateId(event.target.value)}
                placeholder="Enter your Login ID"
                autoComplete="username"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="grievance-login-password">Password</label>
              <div className="login-password-wrap">
                <input
                  id="grievance-login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => updatePassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-show-password"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button className="btn btn-primary" type="submit">
              Sign In
            </button>
          </form>

          <div className="demo-creds">
            <b>Login help</b>
            <span>Use your assigned Login ID and password. Your role and access permissions are detected automatically.</span>
          </div>

          <button type="button" className="back-link" onClick={onBack}>
            <ChevronRight size={14} /> Back to Welcome Page
          </button>
        </section>
      </section>
    </main>
  );
}
