import { createContext, useCallback, useContext, useState } from 'react';

const AdminContext = createContext(null);
const STORAGE_KEY = 'gw-admin-token';

// Isi VITE_API_BASE di .env frontend kamu, contoh: VITE_API_BASE=http://localhost:4000
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY));
  const [admin, setAdmin] = useState(null);

  const login = useCallback(async (username, password) => {
    let res;
    try {
      res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
    } catch {
      return { ok: false, error: 'Gak bisa konek ke server' };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body.error || 'Username atau password salah' };
    }

    const body = await res.json();
    sessionStorage.setItem(STORAGE_KEY, body.token);
    setToken(body.token);
    setAdmin(body.admin);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  // Pakai ini buat semua request yang butuh hak admin (POST/PATCH/DELETE).
  // GET data publik (roster & tim buat dilihat semua orang) gak perlu lewat sini.
  const authFetch = useCallback(async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    if (res.status === 401) logout(); // token invalid/kedaluwarsa -> auto logout
    return res;
  }, [token, logout]);

  return (
    <AdminContext.Provider value={{ isAdmin: !!token, admin, login, logout, authFetch }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin harus dipakai di dalam <AdminProvider>');
  return ctx;
}
