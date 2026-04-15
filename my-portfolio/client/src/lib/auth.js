/**
 * Auraeon Auth — API utilities for devingaughan.com private backend.
 * Token stored in sessionStorage (clears on tab close for security).
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://api.devingaughan.com';

const TOKEN_KEY = 'auraeon_token';
const USER_KEY  = 'auraeon_user';

export function getToken()    { return sessionStorage.getItem(TOKEN_KEY); }
export function getUser()     { return sessionStorage.getItem(USER_KEY); }
export function isLoggedIn()  { return !!getToken(); }

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

function storeAuth(token, username) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, username);
}

async function apiFetch(path, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });

  if (res.status === 401) {
    logout();
    throw new Error('Session expired — please log in again.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

// ── Auth ────────────────────────────────────────────────
export async function login(username, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  storeAuth(data.token, data.username);
  return data;
}

export async function verifyToken() {
  try {
    await apiFetch('/api/auth/verify');
    return true;
  } catch {
    return false;
  }
}

export async function changePassword(currentPassword, newPassword) {
  return apiFetch('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
}

// ── Library ─────────────────────────────────────────────
export async function fetchBooks(category, priority) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (priority) params.set('priority', priority);
  const qs = params.toString();
  return apiFetch(`/api/library/books${qs ? '?' + qs : ''}`);
}

export async function updateBook(bookId, updates) {
  return apiFetch(`/api/library/books/${bookId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteBook(bookId) {
  return apiFetch(`/api/library/books/${bookId}`, { method: 'DELETE' });
}
