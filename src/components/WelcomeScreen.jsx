
import {
  ChevronRight,
  Award,
  UserRound,
} from "lucide-react";

export default function WelcomeScreen({ onSignIn }) {
  return (
    <div className="welcome-wrap">
      {/* Header */}
      <header className="welcome-topbar">
        <div className="welcome-topbar-left">
          <div className="welcome-logo">
            <img
              src="/kl_logo.svg"
              alt="KL University Logo"
            />
          </div>

          <div className="welcome-brand-details">
            <div className="welcome-brand-line">
              <span>KL CSE-4</span>
              <span className="welcome-portal-tag">
                PORTAL
              </span>
            </div>

            <div className="welcome-dept-line">
              Department of Computer Science &amp; Engineering
            </div>
          </div>
        </div>

        <div className="welcome-topbar-center">
          <div className="welcome-org-name">
            Koneru Lakshmaiah Education Foundation
          </div>
          <div className="welcome-org-sub">
            STUDENT GRIEVANCE PORTAL
          </div>
        </div>

        <div className="welcome-header-actions">
          <button
            type="button"
            className="welcome-profile-btn"
            aria-label="Sign in"
            onClick={onSignIn}
          >
            <UserRound size={17} />
          </button>

          <button
            type="button"
            className="welcome-signin-btn"
            onClick={onSignIn}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Welcome Section */}
      <main className="welcome-body">
        <section className="welcome-main">
          <div className="welcome-card">
            <div className="welcome-badge">
              <Award size={13} />
              <span>DEPARTMENT PORTAL</span>
            </div>

            <h1 className="welcome-heading">
              Welcome to KL CSE-4
            </h1>

            <p className="welcome-subheading">
              Student Grieveance Portal
            </p>

            <p className="welcome-desc">
             A centralized platform for student grievances, feedback, and resolution tracking.
            </p>

            <button
              type="button"
              className="welcome-cta"
              onClick={onSignIn}
            >
              <span>Sign In to Portal</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
