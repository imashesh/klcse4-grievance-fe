import { useState } from "react";
import { CheckCircle2, XCircle, X, Paperclip, User, Users, GraduationCap, Crown } from "lucide-react";
import { STAGE_ORDER, STAGE_META } from "../constants";
import StatusBadge from "./StatusBadge";

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STAGE_ICONS = {
  faculty: User,
  coordinator: Users,
  deputy_hod: GraduationCap,
  hod: Crown,
};

function CaseFileTracker({ grievance }) {
  let terminal = false;
  const display = {};
  const history = grievance.history || [];

  for (const stage of STAGE_ORDER) {
    const entry = history.find(h => h.stage === stage);
    if (entry) {
      if (entry.action === "approved") display[stage] = { cls: "done", text: "Approved" };
      else if (entry.action === "resolved") { display[stage] = { cls: "done", text: "Resolved here" }; terminal = true; }
      else if (entry.action === "rejected") { display[stage] = { cls: "rejected", text: "Rejected" }; terminal = true; }
    } else if (!terminal && grievance.currentStage === stage && grievance.status === "Pending") {
      display[stage] = { cls: "current", text: "In review" };
    } else if (terminal) {
      display[stage] = { cls: "skipped", text: "Not required" };
    } else {
      display[stage] = { cls: "", text: "Awaiting" };
    }
  }

  return (
    <div className="file-folder">
      <div className="folder-line" />
      {STAGE_ORDER.map(stage => {
        const meta = STAGE_META[stage];
        const Icon = STAGE_ICONS[stage];
        const { cls, text } = display[stage];
        return (
          <div key={stage} className={`folder-tab ${cls}`}>
            <div className="stage-icon-wrap">
              {cls === "rejected" ? <XCircle size={17}/> : cls === "done" ? <CheckCircle2 size={17}/> : <Icon size={16}/>}
            </div>
            <div className="stage-name">{meta.label}</div>
            <div className="stage-status">{text}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function GrievanceDetailModal({ grievance, onClose, actor, canReject, onAct }) {
  const [remarks, setRemarks] = useState("");
  const canActOnIt = actor && grievance.currentStage === actor.stage && grievance.status === "Pending";
  const history = grievance.history || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2>{grievance.typeLabel}</h2>
            <div className="ref">{grievance.refNo} · Filed by {grievance.studentName} ({grievance.batch})</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20}/></button>
        </div>
        <div className="modal-body">
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 18}}>
            <StatusBadge status={grievance.status} />
            <span style={{fontFamily:"var(--font-mono)", fontSize:11.5, color:"var(--slate-light)"}}>{fmtDate(grievance.createdAt)}</span>
          </div>

          <CaseFileTracker grievance={grievance} />

          <div className="student-info-card">
            <h4 className="student-info-title">Filed By</h4>
            <div className="student-info-grid">
              <div className="student-info-item">
                <span className="student-info-label">Student ID</span>
                <span className="student-info-value mono">{grievance.studentId}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Name</span>
                <span className="student-info-value">{grievance.studentName}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Batch</span>
                <span className="student-info-value"><span className="pill">{grievance.batch}</span></span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Category</span>
                <span className="student-info-value">{grievance.category}</span>
              </div>
              {grievance.facultyId && (
                <div className="student-info-item">
                  <span className="student-info-label">Faculty Counsellor</span>
                  <span className="student-info-value mono">{grievance.facultyId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="desc-box">{grievance.description}</div>

          {grievance.attachmentName && (
            <a className="attach-chip" href={grievance.attachmentData} download={grievance.attachmentName} target="_blank" rel="noopener noreferrer">
              <Paperclip size={13}/> {grievance.attachmentName}
              <span className="attach-view">View / Download</span>
            </a>
          )}

          {history.length > 0 && (
            <div style={{marginBottom: 6}}>
              <h4 style={{fontFamily:"var(--font-display)", fontSize:15, color:"var(--ink-navy)", margin:"0 0 12px", fontWeight:600}}>Case history</h4>
              {history.map((h, i) => (
                <div key={i} className={`history-item ${h.action === "rejected" ? "rejected" : ""}`}>
                  <div className="h-top">
                    <span>{STAGE_META[h.stage]?.label || h.stage} — {h.actorName}</span>
                    <span className="h-when">{fmtDate(h.timestamp)}</span>
                  </div>
                  <div className="h-remarks">
                    {h.action === "rejected" ? "Rejected: " : h.action === "resolved" ? "Marked resolved: " : "Approved: "}
                    {h.remarks}
                  </div>
                </div>
              ))}
            </div>
          )}

          {canActOnIt && (
            <div className="action-box">
              <h4>Your decision — {STAGE_META[actor.stage]?.label}</h4>
              <textarea placeholder="Enter your remarks (required)…" value={remarks} onChange={e => setRemarks(e.target.value)} />
              <div className="action-btns">
                {actor.stage === "hod" ? (
                  <button className="btn btn-brass" disabled={!remarks.trim()} onClick={() => { onAct(grievance.id, "approved", remarks.trim()); onClose(); }}>
                    <CheckCircle2 size={15}/> Approve &amp; Resolve
                  </button>
                ) : (
                  <>
                    <button className="btn btn-brass" disabled={!remarks.trim()} onClick={() => { onAct(grievance.id, "approved", remarks.trim()); onClose(); }}>
                      <CheckCircle2 size={15}/> Approve &amp; Forward
                    </button>
                    <button className="btn btn-ghost" disabled={!remarks.trim()} onClick={() => { onAct(grievance.id, "resolved", remarks.trim()); onClose(); }}>
                      Resolve Here
                    </button>
                  </>
                )}
                {canReject && (
                  <button className="btn btn-maroon" disabled={!remarks.trim()} onClick={() => { onAct(grievance.id, "rejected", remarks.trim()); onClose(); }}>
                    <XCircle size={15}/> Reject
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
