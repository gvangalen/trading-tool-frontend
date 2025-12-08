"use client";

import { API_BASE_URL } from "@/lib/config";

/* =======================================================
   📌 Local Storage Helpers (centrale opslag)
======================================================= */

const LOCAL_USER_KEY = "tt_current_user";

export function saveUserLocal(user: any) {
  if (!user) return;
  if (typeof window === "undefined") return;
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
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_USER_KEY);
}

/* =======================================================
   🆔 user_id helpers (blijft voor apiClient)
======================================================= */

export function getCurrentUserId(): number | null {
  const user = loadUserLocal();
  return user?.id ? Number(user.id) : null;
}

export function setCurrentUserId(id: number | string) {
  if (typeof window === "undefined") return;

  const existing = loadUserLocal() || {};
  const merged = { ...existing, id: Number(id) };

  saveUserLocal(merged);
}

export function clearCurrentUserId() {
  clearUserLocal();
}

/* =======================================================
   🌐 fetchAuth — altijd cookies meesturen
   - GEEN Bearer headers
   - Stuurt HttpOnly cookies mee via credentials: "include"
   - Geeft direct JSON terug (of null)
======================================================= */

async function fetchAuthInternal(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    // Voor gewone calls gooien we een error; login/refresh gebruiken eigen fetch
    const text = await res.text().catch(() => "");
    console.error(`❌ fetchAuth ${path} failed:`, res.status, text);
    throw new Error(`Auth request failed (${res.status})`);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const fetchAuth = fetchAuthInternal;

/* =======================================================
   🔐 LOGIN (gebruikt eigen fetch, geen fetchAuth)
======================================================= */

export async function apiLogin(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        success: false,
        message: body?.detail || "Ongeldige inloggegevens",
      };
    }

    const data = await res.json();
    const user = data.user || data;

    // Backend zet cookies, wij bewaren alleen user in localStorage
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
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
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

export async function apiRefresh(refreshToken?: string) {
  // In jouw huidige setup doet de backend refresh via cookie,
  // dus refreshToken in body is optioneel / niet nodig.
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: refreshToken ? JSON.stringify({ refresh_token: refreshToken }) : undefined,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("❌ apiRefresh failed:", res.status, body);
      return { success: false };
    }

    const data = await res.json().catch(() => ({}));
    // access_token wordt door backend NIET in cookie gezet in Bearer-mode,
    // maar in jouw huidige cookie-setup gebruiken we dit niet meer actief.
    return { success: true, ...data };
  } catch (err) {
    console.error("❌ apiRefresh error:", err);
    return { success: false };
  }
}

/* =======================================================
   👤 ME — synchroniseert backend → localStorage
======================================================= */

export async function apiMe() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
