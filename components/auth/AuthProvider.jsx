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
   fetchWithAuth — werkt met HttpOnly cookies
=========================================================== */
async function fetchWithAuth(url: string, options: any = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  return res;
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
        const data = await res.json(); // <-- rechtstreeks user-object
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
     2) TOKEN REFRESHER (1x per 50 minuten)
  ------------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetchWithAuth(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
        });
      } catch (e) {
        console.error("❌ Fout bij token refresh:", e);
      }
    }, 50 * 60 * 1000); // elke 50 minuten

    return () => clearInterval(interval);
  }, []);

  /* -------------------------------------------------------
     3) LOGIN
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

      // login return heeft structuur: { success, user }
      const data = await res.json();

      setUser(data.user || null);

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
  }, []);

  /* -------------------------------------------------------
     Values exposed
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
