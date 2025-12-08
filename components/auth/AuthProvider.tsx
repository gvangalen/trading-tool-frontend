"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { API_BASE_URL } from "@/lib/config";
import {
  saveUserLocal,
  loadUserLocal,
  clearUserLocal,
} from "@/lib/api/user";

const AuthContext = createContext<any>(null);

/* ===========================================================
   Hook
=========================================================== */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ===========================================================
   fetchWithAuth — stuurt cookies mee
=========================================================== */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  return await fetch(url, {
    credentials: "include", // ⬅️ CRUCIAAL VOOR JWT COOKIES
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
}

/* ===========================================================
   AUTH PROVIDER
=========================================================== */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(loadUserLocal());
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     1) SESSION LADEN (met kleine delay + retry)
  ------------------------------------------------------- */
  const loadSession = useCallback(async () => {
    try {
      // 🩹 Fix race condition: cookies zijn soms 0–50ms te laat
      await new Promise((r) => setTimeout(r, 30));

      const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/me`);

      if (res.ok) {
        const u = await res.json();

        setUser(u);
        saveUserLocal(u);
      } else {
        setUser(null);
        clearUserLocal();
      }
    } catch (err) {
      console.error("❌ Session load error:", err);
      setUser(null);
      clearUserLocal();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  /* -------------------------------------------------------
     2) TOKEN REFRESH (werkt met HttpOnly cookie)
  ------------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetchWithAuth(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
        });
      } catch (err) {
        console.error("❌ Token refresh fout:", err);
      }
    }, 50 * 60 * 1000); // 50 min

    return () => clearInterval(interval);
  }, []);

  /* -------------------------------------------------------
     3) LOGIN — FIXED ✔ data.user gebruiken
  ------------------------------------------------------- */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return { success: false, message: "Ongeldige inloggegevens" };
      }

      const data = await res.json();
      const u = data.user; // ⬅️ BELANGRIJK: backend stuurt { success, user }

      setUser(u);
      saveUserLocal(u);

      return { success: true };
    } catch (err) {
      console.error("❌ Login fout:", err);
      return { success: false, message: "Serverfout" };
    }
  }, []);

  /* -------------------------------------------------------
     4) LOGOUT
  ------------------------------------------------------- */
  const logout = useCallback(async () => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.error("❌ Logout fout:", err);
    }

    setUser(null);
    clearUserLocal();
  }, []);

  /* -------------------------------------------------------
     CONTEXT OUTPUT
  ------------------------------------------------------- */
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    fetchWithAuth,
    reload: loadSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
