import { Award, ArrowRight, ShieldCheck, ClipboardCheck, Users } from "lucide-react";

export default function WelcomeScreen({ onSignIn }) {
  return (
    <div className="reference-home">
      <header className="reference-home-header">
        <div className="reference-home-brand">
          <img src="/kl_logo.svg" alt="KL University" />
          <div><strong>KL CSE-4</strong><span>DEPARTMENT PORTAL</span></div>
        </div>
        <div className="reference-home-university"><strong>Koneru Lakshmaiah Education Foundation</strong><span>STUDENT GRIEVANCE PORTAL</span></div>
        <button type="button" onClick={onSignIn} className="reference-home-signin">Sign In <ArrowRight size={16}/></button>
      </header>
      <main className="reference-home-main">
        <div className="reference-home-card">
          <aside className="reference-home-panel">
            <div className="reference-home-logo"><img src="/kl_logo.svg" alt="KL University emblem"/></div>
            <div className="reference-home-kicker">KL CSE-4 · STUDENT SUPPORT PORTAL</div>
            <h1>Student Grievance Portal</h1>
            <p>A unified platform for student grievance submission, transparent review, and timely resolution across the department.</p>
            <div className="reference-home-panel-footer">KL UNIVERSITY · DEPARTMENT OF CSE-4</div>
          </aside>
          <section className="reference-home-content">
            <div className="reference-home-eyebrow"><Award size={15}/> WELCOME TO KL CSE-4</div>
            <h2>Your voice matters.<br/><strong>We're here to help.</strong></h2>
            <p className="reference-home-lead">A simpler way to raise and resolve concerns.</p>
            <p className="reference-home-description">Submit grievances, monitor progress and stay informed at every stage, from your faculty counsellor to the Head of Department.</p>
            <div className="reference-home-features">
              <span><ClipboardCheck size={17}/> Easy grievance tracking</span>
              <span><ShieldCheck size={17}/> Secure access</span>
              <span><Users size={17}/> Multi-level review</span>
              <span><Award size={17}/> Transparent resolutions</span>
            </div>
            <button type="button" onClick={onSignIn} className="reference-home-primary">Sign In to Portal <ArrowRight size={18}/></button>
            <p className="reference-home-note">Authorized students, faculty and department staff only.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
