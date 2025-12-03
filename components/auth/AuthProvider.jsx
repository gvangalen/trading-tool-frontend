"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { API_BASE_URL } from "@/lib/config";

const AuthContext = createContext(null);

/* ===========================================================
   Hook
=========================================================== */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ===========================================================
   fetchWithAuth — HttpOnly cookies
=========================================================== */
async function fetchWithAuth(url, options = {}) {
  return await fetch(url, {
    credentials: "include",
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
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, email, role }
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     1) SESSION LADEN BIJ APP START
  ------------------------------------------------------- */
  const loadSession = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/me`);

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Fout bij ophalen session:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  /* -------------------------------------------------------
     2) TOKEN REFRESH (1x per 50 min)
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
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /* -------------------------------------------------------
     3) LOGIN
  ------------------------------------------------------- */
  const login = useCallback(async (email, password) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return {
          success: false,
          message: "Ongeldige inloggegevens",
        };
      }

      const data = await res.json();
      setUser(data.user || null);

      return { success: true };
    } catch (err) {
      console.error("❌ Login fout:", err);
      return { success: false, message: "Serverfout" };
    }
  }, []);

  /* -------------------------------------------------------
     4) LOGOUT — ZONDER UI (UI doet AvatarMenu)
  ------------------------------------------------------- */
  const logout = useCallback(async () => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.error("❌ Logout fout:", err);
    }

    // Session leegmaken; redirect & snackbar doet de caller
    setUser(null);
  }, []);

  /* -------------------------------------------------------
     Output
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
