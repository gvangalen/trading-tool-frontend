"use client";

import { API_BASE_URL } from "@/lib/config";

/* =======================================================
   📌 Local Storage Helpers
======================================================= */

const LOCAL_USER_KEY = "tt_current_user";

export function saveUserLocal(user: any) {
  if (!user) return;
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

export function loadUserLocal() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(LOCAL_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearUserLocal() {
  localStorage.removeItem(LOCAL_USER_KEY);
}

/* =======================================================
   🆔 Belangrijk: user_id ophalen voor API calls
======================================================= */
export function getCurrentUserId(): number | null {
  const user = loadUserLocal();
  return user?.id ? Number(user.id) : null;
}

/* =======================================================
   🌐 Global fetch wrapper
======================================================= */
async function fetchAuth(path: string, options: any = {}) {
  return await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include", // ⬅️ kritische fix
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

/* =======================================================
   🔐 LOGIN
======================================================= */
export async function apiLogin(email: string, password: string) {
  try {
    const res = await fetchAuth(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const msg = body?.detail || "Ongeldige inloggegevens";
      return { success: false, message: msg };
    }

    const data = await res.json();
    const user = data.user || data;

    saveUserLocal(user);

    return { success: true, user };
  } catch (err) {
    console.error("❌ apiLogin error:", err);
    return { success: false, message: "Serverfout" };
  }
}

/* =======================================================
   🚪 LOGOUT
======================================================= */
export async function apiLogout() {
  try {
    await fetchAuth(`/api/auth/logout`, { method: "POST" });

    clearUserLocal();

    return { success: true };
  } catch (err) {
    console.error("❌ apiLogout error:", err);
    return { success: false };
  }
}

/* =======================================================
   🔁 REFRESH TOKEN
======================================================= */
export async function apiRefresh() {
  try {
    const res = await fetchAuth(`/api/auth/refresh`, { method: "POST" });
    return { success: res.ok };
  } catch (err) {
    console.error("❌ apiRefresh error:", err);
    return { success: false };
  }
}

/* =======================================================
   👤 ME — haalt backend user op en synchroniseert lokaal
======================================================= */
export async function apiMe() {
  try {
    const res = await fetchAuth(`/api/auth/me`);

    if (!res.ok) {
      clearUserLocal();
      return { success: false, user: null };
    }

    const user = await res.json();

    saveUserLocal(user);

    return { success: true, user };
  } catch (err) {
    console.error("❌ apiMe error:", err);
    return { success: false, user: null };
  }
}
