import { useState } from "react";
import {
  ChevronRight,
  AlertCircle,
  GitBranch,
  Lock,
  BookOpen,
} from "lucide-react";

export default function LoginScreen({ onLogin, error, clearError }) {
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
    <main className="grv-login-page">
      <section className="grv-login-card" aria-label="Student Grievance Portal sign in">
        <aside className="grv-login-visual">
          <div className="grv-department-mark">
            <div className="grv-logo">
              <img src="/kl_logo.svg" alt="KL University emblem" />
            </div>
            <span>Department of CSE-4</span>
          </div>

          <div className="grv-visual-copy">
            <h1>Student Grievance Portal</h1>
            <p>
              A centralized platform for submitting student grievances, tracking
              their status, and managing the resolution process with transparency
              and accountability.
            </p>
          </div>

          <div className="grv-orbit grv-orbit-one" />
          <div className="grv-orbit grv-orbit-two" />
          <div className="grv-visual-footer">
            KL UNIVERSITY <span>·</span> CSE-4 <span>·</span> STUDENT GRIEVANCE PORTAL
          </div>
        </aside>

        <section className="grv-login-panel">
          <div className="grv-back-label">
            <ChevronRight size={14} className="grv-back-chevron" />
            <span>Secure Portal Access</span>
          </div>

          <div className="grv-login-heading">
            <h2>Sign In to Portal</h2>
            <p>Enter your credentials to access the grievance system.</p>
          </div>

          <div className="grv-feature-list">
            <div className="grv-feature-icon"><GitBranch size={17} /></div>
            <div>
              <strong>Multi-Level Review</strong>
              <small>Faculty → Coordinator → Deputy HOD → HOD</small>
            </div>

            <div className="grv-feature-icon"><BookOpen size={17} /></div>
            <div>
              <strong>Transparent Grievance Tracking</strong>
              <small>Follow every stage of your grievance resolution</small>
            </div>

            <div className="grv-feature-icon"><Lock size={17} /></div>
            <div>
              <strong>Secure &amp; Confidential</strong>
              <small>Role-based access for students and staff</small>
            </div>
          </div>

          {error && (
            <div className="grv-login-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="grv-login-form" onSubmit={submit}>
            <label htmlFor="grievance-login-id">Login ID</label>
            <input
              id="grievance-login-id"
              value={id}
              onChange={(event) => updateId(event.target.value)}
              placeholder="Enter your Login ID"
              autoComplete="username"
              required
            />

            <label htmlFor="grievance-login-password">Password</label>
            <div className="grv-password-wrap">
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
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button className="grv-submit-button" type="submit">
              Sign In
            </button>
          </form>

          <div className="grv-login-help">
            <strong>Login help</strong>
            <p>
              Use your assigned Login ID and password. Your authorized access is
              detected automatically.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
