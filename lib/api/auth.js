// lib/auth.js
"use client";

import { API_BASE_URL } from "@/lib/config";

/* ==========================================
   🌐 Global helper — gebruikt HttpOnly cookies
========================================== */
async function fetchAuth(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return res;
}

/* ==========================================
   🔐 LOGIN
========================================== */
export async function apiLogin(email, password) {
  try {
    const res = await fetchAuth(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.detail;
      return { success: false, message: msg || "Ongeldige inloggegevens" };
    }

    const data = await res.json();
    return { success: true, user: data.user };
  } catch (err) {
    console.error("❌ apiLogin error:", err);
    return { success: false, message: "Serverfout" };
  }
}

/* ==========================================
   🚪 LOGOUT
========================================== */
export async function apiLogout() {
  try {
    await fetchAuth(`/api/auth/logout`, {
      method: "POST",
    });
    return { success: true };
  } catch (err) {
    console.error("❌ apiLogout error:", err);
    return { success: false };
  }
}

/* ==========================================
   🤖 REFRESH (vernieuwt access_token)
========================================== */
export async function apiRefresh() {
  try {
    const res = await fetchAuth(`/api/auth/refresh`, {
      method: "POST",
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("❌ apiRefresh error:", err);
    return { success: false };
  }
}

/* ==========================================
   🧍 CURRENT USER
========================================== */
export async function apiMe() {
  try {
    const res = await fetchAuth(`/api/auth/me`);

    if (!res.ok) {
      return { success: false, user: null };
    }

    const data = await res.json();
    return { success: true, user: data };
  } catch (err) {
    console.error("❌ apiMe error:", err);
    return { success: false, user: null };
  }
}
