import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginScreen({ onLogin, error, clearError }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submit(event) {
    event.preventDefault();
    if (id.trim() && password) onLogin(id.trim(), password);
  }

  return (
    <main className="reference-login">
      <div className="reference-login-card">
        <aside className="reference-login-brand">
          <div className="reference-login-logo">
            <img src="/kl_logo.svg" alt="KL University logo" />
          </div>
          <div className="reference-login-kicker">KL CSE-4 · STUDENT SUPPORT PORTAL</div>
          <h1>Student Grievance Portal</h1>
          <p>A unified platform for submitting student grievances, monitoring their progress, and coordinating transparent departmental resolutions.</p>
        </aside>

        <section className="reference-login-form-panel">
          <div className="reference-login-heading">
            <p className="reference-login-eyebrow">Welcome back</p>
            <h2>Sign in to continue</h2>
            <p className="reference-login-intro">Enter your Login ID and password to access the Student Grievance Portal.</p>
          </div>

          <form onSubmit={submit} className="reference-login-form">
            <label htmlFor="grievance-login-id">Username</label>
            <input
              id="grievance-login-id"
              required
              autoComplete="username"
              value={id}
              onChange={event => { setId(event.target.value); clearError(); }}
              placeholder="Enter your username"
            />
            <label htmlFor="grievance-login-password">Password</label>
            <div className="reference-password-field">
              <input
                id="grievance-login-password"
                required
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={event => { setPassword(event.target.value); clearError(); }}
                placeholder="Enter your password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(value => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <div role="alert" className="reference-login-error">{error}</div>}
            <button type="submit" className="reference-login-submit">Sign In</button>
          </form>
          <p className="reference-login-copyright">© {new Date().getFullYear()} Student Grievance Portal</p>
        </section>
      </div>
    </main>
  );
}
