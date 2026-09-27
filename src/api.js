import axios from 'axios';

const api = axios.create({ baseURL: 'https://klgreviancebackend-production.up.railway.app/api' });

export async function login(loginId, password) {
  const res = await api.post('/auth/login', { loginId, password });
  return res.data;
}

export async function getMyGrievances(studentId) {
  const res = await api.get(`/grievances/student/${studentId}`);
  return res.data;
}

export async function getAllGrievances() {
  const res = await api.get('/grievances');
  return res.data;
}

export async function getApproverQueue(stage, role, userId, batch, categories) {
  const params = { stage, role, userId };
  if (batch) params.batch = batch;
  if (categories) params.categories = categories;
  const res = await api.get('/grievances/queue', { params });
  return res.data;
}

export async function createGrievance(data) {
  const res = await api.post('/grievances', data);
  return res.data;
}

export async function actOnGrievance(id, action, remarks, actorId, actorName, actorRole) {
  const res = await api.put(`/grievances/${id}/action`, {
    action, remarks, actorId, actorName, actorRole
  });
  return res.data;
}

export async function getGrievanceStats() {
  const res = await api.get('/grievances/stats');
  return res.data;
}

export async function getUsers(role) {
  const res = await api.get('/users', { params: { role } });
  return res.data;
}

export async function addUser(data) {
  const res = await api.post('/users', data);
  return res.data;
}

export async function bulkAddUsers(role, rows) {
  const res = await api.post('/users/bulk', { role, rows });
  return res.data;
}

export async function updateUser(id, data) {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
}

export async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}

export async function getUserStats() {
  const res = await api.get('/users/stats');
  return res.data;
}
