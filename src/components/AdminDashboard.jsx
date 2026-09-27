import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Users, FileText, Pencil, Trash2, X, Check, BarChart3, ClipboardList, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import { BATCHES, CATEGORIES, STAGE_META } from "../constants";
import { getUsers, getUserStats, getGrievanceStats, getAllGrievances, addUser as addUserAPI, bulkAddUsers as bulkAPI, updateUser as updateUserAPI, deleteUser as deleteUserAPI } from "../api";
import StatusBadge from "./StatusBadge";
import GrievanceDetailModal from "./GrievanceDetailModal";

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ---- Edit User Modal ----
function EditUserModal({ user, role, onClose, onSaved, showToast }) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState(user.batch || BATCHES[0]);
  const [facultyId, setFacultyId] = useState(user.facultyId || "");
  const [categories, setCategories] = useState(user.categories ? user.categories.split(",") : [CATEGORIES[0]]);
  const [saving, setSaving] = useState(false);

  const showBatch = role === "student" || role === "coordinator";
  const showFaculty = role === "student";
  const showCategory = role === "deputy_hod";

  function toggleCategory(c) {
    setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    const data = { name: name.trim() };
    if (password.trim()) data.password = password.trim();
    if (showBatch) data.batch = batch;
    if (showFaculty) data.facultyId = facultyId.trim();
    if (showCategory) data.categories = categories.join(",");
    try {
      const res = await updateUserAPI(user.id, data);
      showToast(res.message || "User updated.");
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update user.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{maxWidth: 480}}>
        <div className="modal-head">
          <div>
            <h2>Edit User</h2>
            <div className="ref">ID: {user.loginId} · Role: {role}</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20}/></button>
        </div>
        <div className="modal-body">
          <div className="field"><label>Full Name</label><input value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="field"><label>New Password (leave blank to keep current)</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Unchanged" /></div>
          {showBatch && (
            <div className="field"><label>Batch</label>
              <select value={batch} onChange={e => setBatch(e.target.value)}>{BATCHES.map(b => <option key={b} value={b}>{b}</option>)}</select>
            </div>
          )}
          {showFaculty && (
            <div className="field"><label>Mapped Faculty Counsellor ID</label>
              <input value={facultyId} onChange={e => setFacultyId(e.target.value)} placeholder="e.g. 5849" />
            </div>
          )}
          {showCategory && (
            <div className="field"><label>Categories</label>
              <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                {CATEGORIES.map(c => (
                  <label key={c} style={{display:"flex", alignItems:"center", gap:5, fontSize:12.5, border:"1px solid var(--paper-line)", borderRadius:20, padding:"5px 10px", background: categories.includes(c) ? "var(--ink-navy)" : "#fff", color: categories.includes(c) ? "var(--parchment)" : "var(--ink-body)", cursor:"pointer"}}>
                    <input type="checkbox" checked={categories.includes(c)} onChange={() => toggleCategory(c)} style={{display:"none"}} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"flex", gap:10, marginTop: 8}}>
            <button className="btn btn-brass" disabled={saving || !name.trim()} onClick={handleSave}><Check size={15}/> {saving ? "Saving…" : "Save Changes"}</button>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Delete Confirm Modal ----
function DeleteConfirmModal({ user, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{maxWidth: 400}}>
        <div className="modal-head">
          <div><h2>Delete User</h2></div>
          <button className="modal-close" onClick={onClose}><X size={20}/></button>
        </div>
        <div className="modal-body">
          <p style={{fontSize: 14, color: "var(--slate)", marginBottom: 18, lineHeight: 1.6}}>
            Are you sure you want to delete <b style={{color:"var(--ink-navy)"}}>{user.name}</b> (ID: <span style={{fontFamily:"var(--font-mono)"}}>{user.loginId}</span>)?
            This action cannot be undone.
          </p>
          <div style={{display:"flex", gap:10}}>
            <button className="btn btn-maroon" onClick={onConfirm}><Trash2 size={14}/> Delete</button>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- User Table ----
function UserTable({ users, role, onEdit, onDelete }) {
  const [q, setQ] = useState("");
  const filtered = q.trim()
    ? users.filter(u => u.loginId.toLowerCase().includes(q.toLowerCase()) || u.name.toLowerCase().includes(q.toLowerCase()))
    : users;
  const showAll = q.trim().length > 0 || users.length <= 150;
  const visible = showAll ? filtered : filtered.slice(0, 150);

  return (
    <div className="table-stable-wrap">
      {users.length > 20 && (
        <div style={{position:"relative", marginBottom: 10}}>
          <Search size={13} style={{position:"absolute", left:10, top:11, color:"var(--slate-light)"}}/>
          <input style={{width:"100%", padding:"8px 10px 8px 30px", border:"1px solid var(--paper-line)", borderRadius:3, fontSize:13, background:"#fff"}}
            placeholder="Search by ID or name…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      )}
      <div className="table-scroll-wrap">
        <table className="user-table">
          <thead>
            <tr>
              <th style={{width:"22%"}}>ID</th>
              <th style={{width:"auto"}}>Name</th>
              <th style={{width:90, textAlign:"center"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={3} style={{textAlign:"center", color:"var(--slate-light)", padding:"18px"}}>No accounts found</td></tr>
            ) : visible.map(u => (
              <tr key={u.loginId + u.role}>
                <td className="mono">{u.loginId}</td>
                <td>
                  {u.name}
                  {u.batch && <span className="pill" style={{marginLeft:8}}>{u.batch}</span>}
                  {u.facultyId && <span style={{fontSize:11, color:"var(--slate-light)", marginLeft:8}}>FC: {u.facultyId}</span>}
                  {u.categories && <span style={{fontSize:11, color:"var(--slate-light)", marginLeft:8}}>{u.categories}</span>}
                </td>
                <td style={{textAlign:"center"}}>
                  <div className="action-btn-group">
                    <button className="edit-btn" onClick={() => onEdit(u)} title="Edit user"><Pencil size={12}/></button>
                    <button className="delete-btn" onClick={() => onDelete(u)} title="Delete user"><Trash2 size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{fontSize:11.5, color:"var(--slate-light)", marginTop:8}}>
        {filtered.length} account(s){q.trim() ? " matching search" : " on record"}{!showAll ? ` — showing first 150` : ""}.
      </p>
    </div>
  );
}

// ---- User Add Panel ----
function UserAddPanel({ role, onAdded, showToast }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState(BATCHES[0]);
  const [categories, setCategories] = useState([CATEGORIES[0]]);
  const [facultyId, setFacultyId] = useState("");
  const [bulkText, setBulkText] = useState("");

  const needsBatch = role === "coordinator";
  const needsCategory = role === "deputy_hod";
  const needsFacultyId = role === "student";
  const bulkEnabled = role === "student" || role === "faculty";

  function toggleCategory(c) {
    setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  async function submitSingle() {
    if (!id.trim() || !name.trim()) return;
    const user = {
      loginId: id.trim(),
      name: name.trim(),
      role,
      password: password.trim() || id.trim(),
    };
    if (needsBatch) user.batch = batch;
    if (needsCategory) user.categories = categories.join(",");
    if (needsFacultyId) {
      user.batch = "Y" + id.trim().slice(0, 2);
      user.facultyId = facultyId.trim();
    }
    try {
      const res = await addUserAPI(user);
      showToast(res.message || "User added.");
      setId(""); setName(""); setPassword(""); setFacultyId("");
      onAdded();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to add user.", "error");
    }
  }

  async function submitBulk() {
    const rows = bulkText.split("\n").map(l => l.split(",").map(s => s.trim())).filter(r => r[0]);
    if (rows.length === 0) return;
    try {
      const res = await bulkAPI(role, rows);
      showToast(`${res.added} added${res.skipped ? `, ${res.skipped} skipped (duplicate ID)` : ""}.`);
      setBulkText("");
      onAdded();
    } catch (err) {
      showToast("Bulk add failed.", "error");
    }
  }

  return (
    <div className="form-card form-card-stable">
      <h3>Add {role === "hod" ? "HOD" : role === "deputy_hod" ? "Deputy HOD" : role.charAt(0).toUpperCase() + role.slice(1)}</h3>
      <div>
        <div className="field"><label>Login ID</label><input value={id} onChange={e => setId(e.target.value)} placeholder={role === "student" ? "e.g. 2500030001" : "e.g. 8145"} /></div>
        <div className="field"><label>Full Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" /></div>
        <div className="field"><label>Password (optional — defaults to their own ID)</label><input value={password} onChange={e => setPassword(e.target.value)} placeholder="Defaults to ID" /></div>
        {needsBatch && (
          <div className="field"><label>Batch</label>
            <select value={batch} onChange={e => setBatch(e.target.value)}>{BATCHES.map(b => <option key={b} value={b}>{b}</option>)}</select>
          </div>
        )}
        {needsCategory && (
          <div className="field"><label>Categories (a Deputy HOD may cover more than one)</label>
            <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
              {CATEGORIES.map(c => (
                <label key={c} style={{display:"flex", alignItems:"center", gap:5, fontSize:12.5, border:"1px solid var(--paper-line)", borderRadius:20, padding:"5px 10px", background: categories.includes(c) ? "var(--ink-navy)" : "#fff", color: categories.includes(c) ? "var(--parchment)" : "var(--ink-body)", cursor:"pointer"}}>
                  <input type="checkbox" checked={categories.includes(c)} onChange={() => toggleCategory(c)} style={{display:"none"}} />
                  {c}
                </label>
              ))}
            </div>
          </div>
        )}
        {needsFacultyId && (
          <div className="field"><label>Mapped Faculty Counsellor ID</label>
            <input value={facultyId} onChange={e => setFacultyId(e.target.value)} placeholder="e.g. 5849" />
          </div>
        )}
        <button className="btn btn-brass" type="button" onClick={submitSingle}><Plus size={15}/> Add Account</button>
      </div>

      {bulkEnabled && (
        <div style={{marginTop: 26, paddingTop: 20, borderTop: "1px dashed var(--paper-line)"}}>
          <h3 style={{marginBottom:8}}>Bulk add {role === "student" ? "students" : "faculty"}</h3>
          <p style={{fontSize:12.5, color:"var(--slate)", marginBottom:12}}>
            One per line: <span style={{fontFamily:"var(--font-mono)"}}>{role === "student" ? "id, name, facultyId, password" : "id, name, password"}</span>
            {role === "student" && " — batch is derived automatically from the ID prefix."}
          </p>
          <textarea className="wide" placeholder={role === "student" ? "2500030999, Priya Nair, 5849\n2500031000, Karthik R, 5849" : "8888, Dr. New Faculty, 8888"} value={bulkText} onChange={e => setBulkText(e.target.value)} />
          <button className="btn btn-ghost btn-sm" style={{marginTop:10}} onClick={submitBulk}><Users size={14}/> Bulk Add</button>
        </div>
      )}
    </div>
  );
}

// ---- User Management ----
function UserManagement({ showToast }) {
  const [role, setRole] = useState("student");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers(role);
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete() {
    if (!deletingUser) return;
    try {
      const res = await deleteUserAPI(deletingUser.id);
      showToast(res.message || "User deleted.");
      setDeletingUser(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete user.", "error");
    }
  }

  const roleOptions = [
    { key: "student", label: "Students" },
    { key: "faculty", label: "Faculty" },
    { key: "coordinator", label: "Coordinators" },
    { key: "deputy_hod", label: "Deputy HODs" },
    { key: "hod", label: "HOD" },
  ];

  return (
    <div>
      <div className="subtabs">
        {roleOptions.map(r => (
          <button key={r.key} className={`subtab ${role === r.key ? "active" : ""}`} onClick={() => setRole(r.key)}>{r.label}</button>
        ))}
      </div>
      <div className="admin-grid">
        {loading ? <div className="table-stable-wrap" style={{padding:20, color:"var(--slate)"}}>Loading…</div> : <UserTable users={users} role={role} onEdit={setEditingUser} onDelete={setDeletingUser} />}
        <UserAddPanel role={role} onAdded={load} showToast={showToast} />
      </div>
      {editingUser && (
        <EditUserModal user={editingUser} role={role} onClose={() => setEditingUser(null)} onSaved={load} showToast={showToast} />
      )}
      {deletingUser && (
        <DeleteConfirmModal user={deletingUser} onClose={() => setDeletingUser(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}

// ---- Full Register ----
function FullRegister() {
  const [grievances, setGrievances] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllGrievances();
        setGrievances(data);
      } catch (err) {
        console.error("Failed to load register", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = grievances.filter(g => {
    const matchesQ = !q || g.refNo.toLowerCase().includes(q.toLowerCase()) || g.studentName.toLowerCase().includes(q.toLowerCase()) || g.typeLabel.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = statusFilter === "All" || g.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  if (loading) return <div className="empty-state"><p>Loading…</p></div>;

  return (
    <div>
      <div style={{display:"flex", gap: 10, marginBottom: 18, flexWrap:"wrap"}}>
        <div style={{position:"relative", flex:1, minWidth:220}}>
          <Search size={14} style={{position:"absolute", left:12, top:12, color:"var(--slate-light)"}}/>
          <input style={{width:"100%", padding:"10px 12px 10px 34px", border:"1px solid var(--paper-line)", borderRadius:3, fontSize:13.5, background:"#fff"}}
            placeholder="Search by ref no, student, or type…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <select style={{padding:"10px 12px", border:"1px solid var(--paper-line)", borderRadius:3, background:"#fff", fontSize:13.5}} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {["All", "Pending", "Resolved", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><FileText size={40}/><h3>No matching records</h3><p>Try a different search term or filter.</p></div>
      ) : (
        <div className="g-list">
          {filtered.sort((a,b) => b.createdAt - a.createdAt).map(g => (
            <div className="g-card" key={g.id} onClick={() => setSelected(g)}>
              <div className="g-card-top">
                <span className="g-ref">{g.refNo}</span>
                <StatusBadge status={g.status} />
              </div>
              <div className="g-type">{g.typeLabel}</div>
              <div className="g-meta">
                <span>By {g.studentName} ({g.batch})</span>
                <span>Category: {g.category}</span>
                <span>Stage: {g.currentStage === "closed" ? "Closed" : STAGE_META[g.currentStage]?.label}</span>
                <span>Filed {fmtDate(g.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <GrievanceDetailModal grievance={selected} onClose={() => setSelected(null)} actor={null} canReject={false} onAct={() => {}} />}
    </div>
  );
}

// ---- Admin Dashboard ----
export default function AdminDashboard({ showToast }) {
  const [tab, setTab] = useState("overview");
  const [userStats, setUserStats] = useState({});
  const [gStats, setGStats] = useState({});
  const [recentGrievances, setRecentGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [us, gs, allG] = await Promise.all([getUserStats(), getGrievanceStats(), getAllGrievances()]);
        setUserStats(us);
        setGStats(gs);
        setRecentGrievances(allG.slice(0, 5));
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    })();
  }, []);

  const totalUsers = (userStats.student || 0) + (userStats.faculty || 0) + (userStats.coordinator || 0) + (userStats.deputy_hod || 0) + (userStats.hod || 0);

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>Administration</h1>
          <p>Manage department accounts and monitor the grievance register.</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}><BarChart3 size={14} style={{marginRight:6}}/> Overview</button>
        <button className={`tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}><Users size={14} style={{marginRight:6}}/> Manage Users</button>
        <button className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}><ClipboardList size={14} style={{marginRight:6}}/> Full Register</button>
      </div>

      {tab === "overview" && (
        <>
          <div className="section-label"><Users size={14}/> Department Accounts</div>
          <div className="stat-row">
            <div className="stat-card stat-card-accent-blue">
              <div className="stat-card-icon"><Users size={18}/></div>
              <div><div className="num">{userStats.student || 0}</div><div className="lbl">Students on Record</div></div>
            </div>
            <div className="stat-card stat-card-accent-green">
              <div className="stat-card-icon"><Users size={18}/></div>
              <div><div className="num">{userStats.faculty || 0}</div><div className="lbl">Faculty Counsellors</div></div>
            </div>
            <div className="stat-card stat-card-accent-amber">
              <div className="stat-card-icon"><Users size={18}/></div>
              <div><div className="num">{userStats.coordinator || 0}</div><div className="lbl">Year Coordinators</div></div>
            </div>
            <div className="stat-card stat-card-accent-purple">
              <div className="stat-card-icon"><Users size={18}/></div>
              <div><div className="num">{userStats.deputy_hod || 0}</div><div className="lbl">Deputy HODs</div></div>
            </div>
          </div>

          <div className="section-label"><FileText size={14}/> Grievance Overview</div>
          <div className="stat-row">
            <div className="stat-card stat-card-accent-blue">
              <div className="stat-card-icon"><FileText size={18}/></div>
              <div><div className="num">{gStats.total || 0}</div><div className="lbl">Total Grievances</div></div>
            </div>
            <div className="stat-card stat-card-accent-amber">
              <div className="stat-card-icon"><Clock size={18}/></div>
              <div><div className="num">{gStats.pending || 0}</div><div className="lbl">In Progress</div></div>
            </div>
            <div className="stat-card stat-card-accent-green">
              <div className="stat-card-icon"><CheckCircle2 size={18}/></div>
              <div><div className="num">{gStats.resolved || 0}</div><div className="lbl">Resolved</div></div>
            </div>
            <div className="stat-card stat-card-accent-red">
              <div className="stat-card-icon"><XCircle size={18}/></div>
              <div><div className="num">{gStats.rejected || 0}</div><div className="lbl">Rejected</div></div>
            </div>
          </div>

          <div className="admin-insights-row">
            <div className="insight-card">
              <div className="insight-header"><TrendingUp size={16}/><span>Quick Insights</span></div>
              <div className="insight-stats">
                <div className="insight-stat">
                  <span className="insight-num">{totalUsers}</span>
                  <span className="insight-label">Total Users</span>
                </div>
                <div className="insight-stat">
                  <span className="insight-num">{gStats.total ? Math.round(((gStats.resolved || 0) / gStats.total) * 100) : 0}%</span>
                  <span className="insight-label">Resolution Rate</span>
                </div>
                <div className="insight-stat">
                  <span className="insight-num">{gStats.total ? Math.round(((gStats.rejected || 0) / gStats.total) * 100) : 0}%</span>
                  <span className="insight-label">Rejection Rate</span>
                </div>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-header"><ClipboardList size={16}/><span>Recent Grievances</span></div>
              {recentGrievances.length === 0 ? (
                <p style={{fontSize: 13, color: "var(--slate)", padding: "12px 0"}}>No grievances filed yet.</p>
              ) : (
                <div className="recent-list">
                  {recentGrievances.map(g => (
                    <div key={g.id} className="recent-item" onClick={() => setSelectedGrievance(g)}>
                      <div className="recent-item-left">
                        <span className="recent-ref">{g.refNo}</span>
                        <span className="recent-type">{g.typeLabel}</span>
                      </div>
                      <div className="recent-item-right">
                        <StatusBadge status={g.status} />
                        <span className="recent-date">{fmtDate(g.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {selectedGrievance && <GrievanceDetailModal grievance={selectedGrievance} onClose={() => setSelectedGrievance(null)} actor={null} canReject={false} onAct={() => {}} />}
        </>
      )}

      {tab === "users" && <UserManagement showToast={showToast} />}
      {tab === "register" && <FullRegister />}
    </div>
  );
}
