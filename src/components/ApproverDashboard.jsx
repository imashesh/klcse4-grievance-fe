import { useState, useEffect, useCallback } from "react";
import { ClipboardList, Clock, CheckCircle2, Inbox, AlertTriangle } from "lucide-react";
import { STAGE_META } from "../constants";
import { getApproverQueue, actOnGrievance as actAPI } from "../api";
import StatusBadge from "./StatusBadge";
import GrievanceDetailModal from "./GrievanceDetailModal";

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ApproverDashboard({ user, stage, canReject, showToast }) {
  const [subtab, setSubtab] = useState("pending");
  const [allGrievances, setAllGrievances] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getApproverQueue(
        stage,
        user.role,
        user.loginId,
        user.batch || null,
        user.categories || null
      );
      setAllGrievances(data);
    } catch (err) {
      console.error("Failed to load queue", err);
    } finally {
      setLoading(false);
    }
  }, [stage, user]);

  useEffect(() => { load(); }, [load]);

  const pending = allGrievances.filter(g => g.currentStage === stage && g.status === "Pending");
  const acted = allGrievances.filter(g =>
    (g.history || []).some(h => h.actorId === user.loginId)
  );
  const list = subtab === "pending" ? pending : acted;

  async function handleAct(grievanceId, action, remarks) {
    try {
      await actAPI(grievanceId, action, remarks, user.loginId, user.name, user.role);
      const msg = action === "rejected" ? "Grievance rejected."
        : action === "resolved" ? "Grievance marked resolved."
        : "Grievance approved and forwarded.";
      showToast(msg);
      load();
    } catch (err) {
      console.error("Action failed", err);
      showToast("Action failed. Please try again.", "error");
    }
  }

  return (
    <div className="container">
      <div className="welcome-banner">
        <div className="welcome-banner-content">
          <h1>{STAGE_META[stage]?.label} Review Queue</h1>
          <p>
            {stage === "faculty" && `Grievances from students you mentor, awaiting your review.`}
            {stage === "coordinator" && `Grievances from batch ${user.batch} forwarded by faculty mentors.`}
            {stage === "deputy_hod" && `Grievances categorised under ${user.categories || "your categories"}, forwarded by year coordinators.`}
            {stage === "hod" && `Grievances forwarded by Deputy HODs, awaiting final decision.`}
          </p>
          <div className="welcome-banner-meta">
            <span className="banner-pill">ID: {user.loginId}</span>
            {user.batch && <span className="banner-pill">Batch: {user.batch}</span>}
            {user.categories && <span className="banner-pill">{user.categories}</span>}
          </div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card stat-card-accent-amber">
          <div className="stat-card-icon"><AlertTriangle size={18}/></div>
          <div><div className="num">{pending.length}</div><div className="lbl">Awaiting Your Action</div></div>
        </div>
        <div className="stat-card stat-card-accent-green">
          <div className="stat-card-icon"><CheckCircle2 size={18}/></div>
          <div><div className="num">{acted.length}</div><div className="lbl">Actioned By You</div></div>
        </div>
        <div className="stat-card stat-card-accent-blue">
          <div className="stat-card-icon"><Inbox size={18}/></div>
          <div><div className="num">{allGrievances.length}</div><div className="lbl">Total In Scope</div></div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${subtab === "pending" ? "active" : ""}`} onClick={() => setSubtab("pending")}><Clock size={14} style={{marginRight:5}}/> Pending Action ({pending.length})</button>
        <button className={`tab ${subtab === "history" ? "active" : ""}`} onClick={() => setSubtab("history")}><ClipboardList size={14} style={{marginRight:5}}/> My Actioned History</button>
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading…</p></div>
      ) : list.length === 0 ? (
        <div className="empty-state-rich">
          <div className="empty-icon-wrap"><ClipboardList size={36} /></div>
          <h3>{subtab === "pending" ? "Nothing pending" : "No actions taken yet"}</h3>
          <p>{subtab === "pending" ? "You're all caught up. New grievances reaching your stage will appear here." : "Once you approve or reject a grievance, it will be listed here for reference."}</p>
        </div>
      ) : (
        <div className="g-list">
          {list.sort((a,b) => b.createdAt - a.createdAt).map(g => (
            <div className="g-card" key={g.id} onClick={() => setSelected(g)}>
              <div className="g-card-top">
                <span className="g-ref">{g.refNo}</span>
                <StatusBadge status={g.status} />
              </div>
              <div className="g-type">{g.typeLabel}</div>
              <div className="g-desc">{g.description.slice(0, 140)}{g.description.length > 140 ? "…" : ""}</div>
              <div className="g-meta">
                <span>By {g.studentName} ({g.batch})</span>
                <span>Filed {fmtDate(g.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <GrievanceDetailModal
          grievance={selected}
          onClose={() => setSelected(null)}
          actor={{ stage }}
          canReject={canReject}
          onAct={handleAct}
        />
      )}
    </div>
  );
}
