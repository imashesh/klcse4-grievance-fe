import { ChevronRight, Award, GitBranch, Eye, Lock, Clock, Users, FileText } from "lucide-react";

export default function WelcomeScreen({ onSignIn }) {
  return (
    <div className="welcome-wrap">
      <div className="welcome-topbar">
        <div className="welcome-topbar-left">
          <div className="welcome-logo"><img src="/kl_logo.svg" alt="KL" style={{width:28, height:28, borderRadius:4}}/></div>
          <div>
            <div className="welcome-brand-line"><span>CSE-4</span><span className="welcome-portal-tag">PORTAL</span></div>
            <div className="welcome-dept-line">Department of Computer Science &amp; Engineering</div>
          </div>
        </div>
        <div className="welcome-topbar-center">
          <div className="welcome-org-name">CSE-4 Student Grievance Portal</div>
          <div className="welcome-org-sub">GRIEVANCE REDRESSAL SYSTEM</div>
        </div>
        <button type="button" className="btn btn-primary welcome-signin-btn" onClick={onSignIn}>Sign In</button>
      </div>

      <div className="welcome-body">
        <div className="welcome-main">
          <div className="welcome-card">
            <div className="welcome-badge"><Award size={13}/> DEPARTMENT PORTAL</div>
            <h1 className="welcome-heading">Welcome to CSE-4</h1>
            <p className="welcome-subheading">Student Grievance Redressal Portal</p>
            <p className="welcome-desc">
              A central platform for students to raise grievances and track them through every
              stage of review — from Faculty Mentor and Year Coordinator to Deputy HOD and
              Head of Department.
            </p>
            <button type="button" className="btn btn-brass welcome-cta" onClick={onSignIn}>
              Sign In to Portal <ChevronRight size={16}/>
            </button>
          </div>

          {/* Feature Cards */}
          <div className="welcome-features">
            <div className="welcome-feature-card">
              <div className="wf-icon wf-icon-blue"><GitBranch size={20}/></div>
              <h3>Multi-Level Review</h3>
              <p>Every grievance passes through four stages of review ensuring thorough examination at each level.</p>
            </div>
            <div className="welcome-feature-card">
              <div className="wf-icon wf-icon-amber"><Eye size={20}/></div>
              <h3>Real-Time Tracking</h3>
              <p>Track your grievance status in real time. Know exactly which stage it's at and who's reviewing it.</p>
            </div>
            <div className="welcome-feature-card">
              <div className="wf-icon wf-icon-green"><Lock size={20}/></div>
              <h3>Secure & Confidential</h3>
              <p>Role-based access ensures only authorised personnel can view and act on grievances.</p>
            </div>
          </div>

          {/* How It Works */}
          <div className="welcome-process">
            <h2 className="welcome-process-title">How It Works</h2>
            <div className="welcome-process-steps">
              <div className="wp-step">
                <div className="wp-step-icon"><FileText size={18}/></div>
                <div className="wp-step-num">1</div>
                <h4>Student Files Grievance</h4>
                <p>Select a category and describe your issue with optional document attachment.</p>
              </div>
              <div className="wp-step-arrow"><ChevronRight size={20}/></div>
              <div className="wp-step">
                <div className="wp-step-icon"><Users size={18}/></div>
                <div className="wp-step-num">2</div>
                <h4>Multi-Stage Review</h4>
                <p>Faculty Mentor → Year Coordinator → Deputy HOD → HOD review in sequence.</p>
              </div>
              <div className="wp-step-arrow"><ChevronRight size={20}/></div>
              <div className="wp-step">
                <div className="wp-step-icon"><Clock size={18}/></div>
                <div className="wp-step-num">3</div>
                <h4>Track & Resolve</h4>
                <p>Track progress at each stage until your grievance is resolved or escalated.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
