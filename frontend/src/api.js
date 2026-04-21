const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function apiFetch(url, options = {}) {
  const headers = { ...authHeaders(), ...options.headers };
  const r = await fetch(url, { ...options, headers });
  if (r.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Non authentifié');
  }
  return r;
}

// ── Auth ──────────────────────────────────────────────
export async function apiLogin(username, password) {
  const r = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) {
    const err = await r.json();
    throw new Error(err.detail || 'Erreur de connexion');
  }
  return r.json();
}

export async function fetchMe() {
  const r = await apiFetch(`${API}/api/auth/me`);
  return r.json();
}

// ── Stats / Dashboard ─────────────────────────────────
export async function fetchStats() {
  const r = await apiFetch(`${API}/api/stats`);
  return r.json();
}

export async function fetchTrajetsRecents() {
  const r = await apiFetch(`${API}/api/trajets/recent`);
  return r.json();
}

// ── Chat ──────────────────────────────────────────────
export async function sendChatMessage(question) {
  const r = await apiFetch(`${API}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  return r.json();
}

// ── History ───────────────────────────────────────────
export async function fetchHistory(limit = 50) {
  const r = await apiFetch(`${API}/api/history?limit=${limit}`);
  return r.json();
}

export async function clearHistory() {
  const r = await apiFetch(`${API}/api/history`, { method: 'DELETE' });
  return r.json();
}

export async function fetchHistoryStats() {
  const r = await apiFetch(`${API}/api/history/stats`);
  return r.json();
}

// ── Transcribe ────────────────────────────────────────
export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  const r = await apiFetch(`${API}/api/transcribe`, {
    method: 'POST',
    body: formData,
  });
  return r.json();
}

// ── Véhicules ─────────────────────────────────────────
export async function fetchVehicules(page = 1, size = 10) {
  const r = await apiFetch(`${API}/api/vehicules?page=${page}&size=${size}`);
  return r.json();
}

// ── Chauffeurs ────────────────────────────────────────
export async function fetchChauffeurs(page = 1, size = 10) {
  const r = await apiFetch(`${API}/api/chauffeurs?page=${page}&size=${size}`);
  return r.json();
}

// ── Admin CRUD ────────────────────────────────────────
export async function createVehicule(data) {
  const r = await apiFetch(`${API}/api/admin/vehicules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function updateVehicule(id, data) {
  const r = await apiFetch(`${API}/api/admin/vehicules/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function deleteVehicule(id) {
  const r = await apiFetch(`${API}/api/admin/vehicules/${id}`, { method: 'DELETE' });
  return r.json();
}

export async function createChauffeur(data) {
  const r = await apiFetch(`${API}/api/admin/chauffeurs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function updateChauffeur(id, data) {
  const r = await apiFetch(`${API}/api/admin/chauffeurs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function deleteChauffeur(id) {
  const r = await apiFetch(`${API}/api/admin/chauffeurs/${id}`, { method: 'DELETE' });
  return r.json();
}

export async function fetchIncidents(page = 1, size = 10) {
  const r = await apiFetch(`${API}/api/admin/incidents?page=${page}&size=${size}`);
  return r.json();
}

export async function updateIncident(id, data) {
  const r = await apiFetch(`${API}/api/admin/incidents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

// ── Password Change ───────────────────────────────────
export async function changePassword(currentPassword, newPassword) {
  const r = await apiFetch(`${API}/api/auth/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  if (!r.ok) {
    const err = await r.json();
    throw new Error(err.detail || 'Erreur');
  }
  return r.json();
}

// ── User Management (admin only) ──────────────────────
export async function fetchUsers(page = 1, size = 10) {
  const r = await apiFetch(`${API}/api/admin/users?page=${page}&size=${size}`);
  return r.json();
}

export async function createUser(data) {
  const r = await apiFetch(`${API}/api/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function updateUser(id, data) {
  const r = await apiFetch(`${API}/api/admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function deleteUser(id) {
  const r = await apiFetch(`${API}/api/admin/users/${id}`, { method: 'DELETE' });
  return r.json();
}
