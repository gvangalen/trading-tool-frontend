"use client";

import { API_BASE_URL } from "@/lib/config";

/* =======================================================
   📌 Local Storage Keys
======================================================= */

const LOCAL_USER_KEY = "tt_current_user";
const LOCAL_TOKEN_KEY = "tt_access_token";

/* =======================================================
   📦 User opslaan
======================================================= */

export function saveUserLocal(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

export function loadUserLocal() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USER_KEY));
  } catch {
    return null;
  }
}

export function clearUserLocal() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_USER_KEY);
}

/* =======================================================
   🔑 Token opslaan
======================================================= */

export function saveAccessToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_TOKEN_KEY, token);
}

export function loadAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCAL_TOKEN_KEY);
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_TOKEN_KEY);
}

/* =======================================================
   🌐 fetchAuth — stuurt ALTIJD Bearer token mee
======================================================= */

export async function fetchAuth(path, options = {}) {
  const token = loadAccessToken();

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

/* =======================================================
   🔐 LOGIN
======================================================= */

export async function apiLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.detail || "Ongeldige inloggegevens",
      };
    }

    // ⬇️ IMPORTANT: token opslaan
    saveAccessToken(data.access_token);

    // user opslaan
    saveUserLocal(data.user);

    return { success: true, user: data.user };
  } catch (err) {
    console.error("❌ apiLogin error:", err);
    return { success: false, message: "Serverfout" };
  }
}

/* =======================================================
   🚪 LOGOUT
======================================================= */

export async function apiLogout() {
  clearAccessToken();
  clearUserLocal();
  return { success: true };
}

/* =======================================================
   🔁 REFRESH TOKEN
======================================================= */

export async function apiRefresh() {
  // Alleen nodig als je refresh token systeem gebruikt
  // (nu nog niet)
  return { success: true };
}

/* =======================================================
   👤 apiMe — synchroniseer backend user naar client
======================================================= */

export async function apiMe() {
  try {
    const res = await fetchAuth(`/api/auth/me`);

    if (!res.ok) {
      clearAccessToken();
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
