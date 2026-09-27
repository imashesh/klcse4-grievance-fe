import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function StatusBadge({ status }) {
  if (status === "Resolved") return <span className="badge badge-resolved"><CheckCircle2 size={12}/> Resolved</span>;
  if (status === "Rejected") return <span className="badge badge-rejected"><XCircle size={12}/> Rejected</span>;
  return <span className="badge badge-pending"><Clock size={12}/> Pending</span>;
}
