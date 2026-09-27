/**
 * Script to extract user data from CSE4-Student-Grievance-Portal.jsx
 * and generate JSON seed files for the Spring Boot backend.
 */
const fs = require('fs');
const path = require('path');

const jsx = fs.readFileSync(path.join(__dirname, '..', 'CSE4-Student-Grievance-Portal.jsx'), 'utf8');

// ---- Extract ADMIN_USERS ----
const adminMatch = jsx.match(/const ADMIN_USERS = \[([\s\S]*?)\];/);
const adminUsers = [];
if (adminMatch) {
  const re = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*role:\s*"([^"]+)"(?:,\s*categories:\s*\[(.*?)\])?(?:,\s*batch:\s*"([^"]+)")?(?:,\s*password:\s*"([^"]+)")?\s*\}/g;
  let m;
  while ((m = re.exec(adminMatch[1])) !== null) {
    const obj = {
      loginId: m[1],
      name: m[2],
      role: m[3],
      password: m[6] || m[1],
    };
    if (m[4]) {
      const cats = m[4].match(/"([^"]+)"/g);
      obj.categories = cats ? cats.map(c => c.replace(/"/g, '')).join(',') : null;
    }
    if (m[5]) obj.batch = m[5];
    adminUsers.push(obj);
  }
}

// ---- Extract FACULTY_LIST ----
const facultyMatch = jsx.match(/const FACULTY_LIST = \[([\s\S]*?)\];/);
const facultyEntries = [];
if (facultyMatch) {
  const re = /\["(\d+)",\s*"([^"]+)"\]/g;
  let m;
  while ((m = re.exec(facultyMatch[1])) !== null) {
    facultyEntries.push([m[1], m[2]]);
  }
}

// ---- Extract FACULTY_PHONE ----
const phoneMatch = jsx.match(/const FACULTY_PHONE = \{([\s\S]*?)\};/);
const facultyPhones = {};
if (phoneMatch) {
  const re = /"(\d+)":\s*"(\d+)"/g;
  let m;
  while ((m = re.exec(phoneMatch[1])) !== null) {
    facultyPhones[m[1]] = m[2];
  }
}

const facultyUsers = facultyEntries.map(([id, name]) => ({
  loginId: id,
  name: name,
  role: 'faculty',
  password: facultyPhones[id] || id,
}));

// Resolve admin passwords from faculty phones
for (const au of adminUsers) {
  if (facultyPhones[au.loginId]) {
    au.password = facultyPhones[au.loginId];
  }
}

// ---- Extract STUDENT_LIST ----
const studentMatch = jsx.match(/const STUDENT_LIST = \[([\s\S]*?)\];/);
const studentEntries = [];
if (studentMatch) {
  const re = /\["(\d+)",\s*"([^"]+)",\s*"(\d+)"\]/g;
  let m;
  while ((m = re.exec(studentMatch[1])) !== null) {
    studentEntries.push([m[1], m[2], m[3]]);
  }
}

// ---- Extract STUDENT_PHONE ----
const sPhoneMatch = jsx.match(/const STUDENT_PHONE = \{([\s\S]*?)\};/);
const studentPhones = {};
if (sPhoneMatch) {
  const re = /"(\d+)":\s*"(\d+)"/g;
  let m;
  while ((m = re.exec(sPhoneMatch[1])) !== null) {
    studentPhones[m[1]] = m[2];
  }
}

const studentUsers = studentEntries.map(([id, name, facultyId]) => ({
  loginId: id,
  name: name,
  role: 'student',
  password: studentPhones[id] || id,
  batch: 'Y' + id.substring(0, 2),
  facultyId: facultyId,
}));

// ---- Write JSON files ----
const seedDir = path.join(__dirname, '..', 'demo', 'src', 'main', 'resources', 'seed');
fs.mkdirSync(seedDir, { recursive: true });

fs.writeFileSync(path.join(seedDir, 'admin_users.json'), JSON.stringify(adminUsers, null, 2));
fs.writeFileSync(path.join(seedDir, 'faculty_users.json'), JSON.stringify(facultyUsers, null, 2));
fs.writeFileSync(path.join(seedDir, 'student_users.json'), JSON.stringify(studentUsers, null, 2));

console.log('Admin users:', adminUsers.length);
console.log('Faculty users:', facultyUsers.length);
console.log('Student users:', studentUsers.length);
console.log('Seed files written to:', seedDir);
