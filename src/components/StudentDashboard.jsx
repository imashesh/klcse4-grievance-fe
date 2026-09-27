import { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Upload, Clock, CheckCircle2, XCircle, AlertTriangle, BookOpen, HelpCircle, ArrowRight } from "lucide-react";
import { GRIEVANCE_TYPES, STAGE_META } from "../constants";
import { getMyGrievances, createGrievance } from "../api";
import StatusBadge from "./StatusBadge";
import GrievanceDetailModal from "./GrievanceDetailModal";

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function NewGrievanceForm({ user, onSubmitted }) {
  const [type, setType] = useState(GRIEVANCE_TYPES[0].key);
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const ALLOWED_EXT = [".pdf", ".doc", ".docx"];

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const nameLower = file.name.toLowerCase();
    const extOk = ALLOWED_EXT.some(ext => nameLower.endsWith(ext));
    if (!extOk) {
      setFileError("Only PDF or DOCX files are allowed.");
      e.target.value = "";
      setAttachment(null);
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setFileError("File too large — please attach something under 3MB.");
      e.target.value = "";
      return;
    }
    setFileError("");
    const reader = new FileReader();
    reader.onload = () => setAttachment({ name: file.name, data: reader.result });
    reader.readAsDataURL(file);
  }

  async function submit() {
    if (!description.trim() || submitting) return;
    setSubmitting(true);
    const meta = GRIEVANCE_TYPES.find(t => t.key === type);
    try {
      await createGrievance({
        studentId: user.loginId,
        studentName: user.name,
        batch: user.batch,
        facultyId: user.facultyId || null,
        type: meta.key,
        typeLabel: meta.label,
        category: meta.category,
        description: description.trim(),
        attachmentName: attachment?.name || null,
        attachmentData: attachment?.data || null,
      });
      onSubmitted();
    } catch (err) {
      console.error("Failed to submit grievance", err);
    } finally {
      setSubmitting(false);
    }
  }

  const selectedMeta = GRIEVANCE_TYPES.find(t => t.key === type);

  return (
    <div className="form-card" style={{maxWidth:"100%"}}>
      <h3>File a new grievance</h3>
      <div className="field">
        <label>Grievance Type</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          {GRIEVANCE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
      </div>
      <p style={{fontSize:12.5, color:"var(--slate)", marginTop:-8, marginBottom:16}}>
        Routes to: Faculty Mentor → Year Coordinator → Deputy HOD ({selectedMeta.category}) → HOD
      </p>
      <div className="field">
        <label>Description</label>
        <textarea className="wide" placeholder="Describe your grievance in detail…" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="field">
        <label>Attachment (optional — PDF or DOCX only)</label>
        <label className="file-drop">
          <Upload size={16}/> {attachment ? attachment.name : "Click to attach a PDF or DOCX (max 3MB)"}
          <input type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={handleFile} />
        </label>
        {fileError && <p style={{color:"var(--maroon)", fontSize:12, marginTop:6}}>{fileError}</p>}
      </div>
      <button className="btn btn-brass" type="button" disabled={!description.trim() || submitting} style={{marginTop:8}} onClick={submit}>
        <FileText size={15}/> {submitting ? "Submitting…" : "Submit Grievance"}
      </button>
    </div>
  );
}

export default function StudentDashboard({ user, showToast, navigate, currentPath }) {
  // Derive tab from URL path so back/forward arrows work
  const tab = currentPath === "/dashboard/new" ? "new" : "list";
  function setTab(t) {
    navigate(t === "new" ? "/dashboard/new" : "/dashboard");
  }
  const [grievances, setGrievances] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getMyGrievances(user.loginId);
      setGrievances(data);
    } catch (err) {
      console.error("Failed to load grievances", err);
    } finally {
      setLoading(false);
    }
  }, [user.loginId]);

  useEffect(() => { load(); }, [load]);

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === "Pending").length,
    resolved: grievances.filter(g => g.status === "Resolved").length,
    rejected: grievances.filter(g => g.status === "Rejected").length,
  };

  return (
    <div className="container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-banner-content">
          <h1>Welcome, {user.name.split(" ")[0]}</h1>
          <p>Track every grievance you've filed, stage by stage, from faculty mentor to HOD.</p>
          <div className="welcome-banner-meta">
            <span className="banner-pill">ID: {user.loginId}</span>
            <span className="banner-pill">Batch: {user.batch}</span>
            {user.facultyId && <span className="banner-pill">Faculty: {user.facultyId}</span>}
          </div>
        </div>
        <button className="btn btn-brass" onClick={() => setTab("new")} style={{flexShrink:0}}><Plus size={16}/> File New Grievance</button>
      </div>

      {/* Stat Cards with Icons */}
      <div className="stat-row">
        <div className="stat-card stat-card-accent-blue">
          <div className="stat-card-icon"><FileText size={18}/></div>
          <div><div className="num">{stats.total}</div><div className="lbl">Total Filed</div></div>
        </div>
        <div className="stat-card stat-card-accent-amber">
          <div className="stat-card-icon"><Clock size={18}/></div>
          <div><div className="num">{stats.pending}</div><div className="lbl">In Progress</div></div>
        </div>
        <div className="stat-card stat-card-accent-green">
          <div className="stat-card-icon"><CheckCircle2 size={18}/></div>
          <div><div className="num">{stats.resolved}</div><div className="lbl">Resolved</div></div>
        </div>
        <div className="stat-card stat-card-accent-red">
          <div className="stat-card-icon"><XCircle size={18}/></div>
          <div><div className="num">{stats.rejected}</div><div className="lbl">Rejected</div></div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>My Grievances</button>
        <button className={`tab ${tab === "new" ? "active" : ""}`} onClick={() => setTab("new")}>File New Grievance</button>
      </div>

      {tab === "new" && (
        <NewGrievanceForm user={user} onSubmitted={() => {
          showToast("Grievance submitted successfully.");
          setTab("list");
          load();
        }} />
      )}

      {tab === "list" && (
        loading ? (
          <div className="empty-state"><p>Loading…</p></div>
        ) : grievances.length === 0 ? (
          <div className="empty-state-rich">
            <div className="empty-icon-wrap"><FileText size={36} /></div>
            <h3>No grievances filed yet</h3>
            <p>When you file a grievance it will appear here with its current stage and full history.</p>
            <button className="btn btn-brass btn-sm" style={{marginTop:14}} onClick={() => setTab("new")}><Plus size={14}/> File Your First Grievance</button>

            {/* How it works section */}
            <div className="how-it-works">
              <h4><HelpCircle size={15}/> How It Works</h4>
              <div className="how-steps">
                <div className="how-step">
                  <div className="how-step-num">1</div>
                  <div>
                    <div className="how-step-title">File a Grievance</div>
                    <div className="how-step-desc">Select a type and describe your issue</div>
                  </div>
                </div>
                <div className="how-step">
                  <div className="how-step-num">2</div>
                  <div>
                    <div className="how-step-title">Multi-Level Review</div>
                    <div className="how-step-desc">Faculty → Coordinator → Deputy HOD → HOD</div>
                  </div>
                </div>
                <div className="how-step">
                  <div className="how-step-num">3</div>
                  <div>
                    <div className="how-step-title">Get Resolution</div>
                    <div className="how-step-desc">Track progress in real time until resolved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="g-list">
            {grievances.sort((a,b) => b.createdAt - a.createdAt).map(g => (
              <div className="g-card" key={g.id} onClick={() => setSelected(g)}>
                <div className="g-card-top">
                  <span className="g-ref">{g.refNo}</span>
                  <StatusBadge status={g.status} />
                </div>
                <div className="g-type">{g.typeLabel}</div>
                <div className="g-desc">{g.description.slice(0, 140)}{g.description.length > 140 ? "…" : ""}</div>
                <div className="g-meta">
                  <span>Filed {fmtDate(g.createdAt)}</span>
                  <span>Stage: {g.currentStage === "closed" ? "Closed" : STAGE_META[g.currentStage]?.label}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {selected && <GrievanceDetailModal grievance={selected} onClose={() => setSelected(null)} actor={null} canReject={false} onAct={() => {}} />}
    </div>
  );
}
