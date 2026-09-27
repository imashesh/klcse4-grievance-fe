export const BATCHES = ["Y25", "Y24", "Y23"];

export const GRIEVANCE_TYPES = [
  { key: "REG", label: "Registration Issue", category: "Academics" },
  { key: "TT", label: "Time Table Issue", category: "Academics" },
  { key: "EXM", label: "Examinations", category: "Academics" },
  { key: "EVL", label: "Evaluations", category: "Evaluations" },
  { key: "DSC", label: "Discipline Issue", category: "Student Affairs" },
  { key: "CRT", label: "CRT Training", category: "Placements" },
  { key: "FDB", label: "Course Feedback", category: "Academics" },
];

export const CATEGORIES = ["Academics", "Evaluations", "Student Affairs", "Placements"];

export const STAGE_ORDER = ["faculty", "coordinator", "deputy_hod", "hod"];

export const STAGE_META = {
  faculty:     { label: "Faculty Mentor" },
  coordinator: { label: "Year Coordinator" },
  deputy_hod:  { label: "Deputy HOD" },
  hod:         { label: "HOD" },
};

export const ROLE_LABELS = {
  admin: "Administrator",
  student: "Student",
  faculty: "Faculty Mentor",
  coordinator: "Year Coordinator",
  deputy_hod: "Deputy HOD",
  hod: "Head of Department",
};
