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
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     1) SESSION LADEN BIJ APP START
  ------------------------------------------------------- */
  const loadSession = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/me`);

      if (res.ok) {
        const data = await res.json();
        setUser(data);         // ✔ juiste structuur
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
     2) TOKEN REFRESH — alleen als ingelogd
  ------------------------------------------------------- */
  useEffect(() => {
    if (!user) return; // ✔ niet refreshen bij logout

    const interval = setInterval(async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
        });

        if (res.ok) {
          await loadSession(); // ✔ user state updaten
        }
      } catch (e) {
        console.error("❌ Fout bij token refresh:", e);
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, loadSession]);

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

      await loadSession();  // ✔ haal actuele user op

      return { success: true };
    } catch (err) {
      console.error("❌ Login fout:", err);
      return { success: false, message: "Serverfout" };
    }
  }, [loadSession]);

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
     VALUES
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
