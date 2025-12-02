"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "@/lib/config";

const AuthContext = createContext(null);

/* ===========================================================
   useAuth hook
=========================================================== */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ===========================================================
   fetchWithAuth — gebruikt HttpOnly cookies
=========================================================== */
async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // 🔥 super belangrijk voor HttpOnly cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return res;
}

/* ===========================================================
   AUTH PROVIDER
=========================================================== */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // { id, email, name }
  const [loading, setLoading] = useState(true); // true totdat session bekend is

  /* -------------------------------------------------------
     Laad user bij app start (cookie → backend → user info)
  ------------------------------------------------------- */
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/me`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("❌ Fout bij ophalen session:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  /* -------------------------------------------------------
     Login functie (email + password)
  ------------------------------------------------------- */
  const login = useCallback(async (email, password) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return { success: false, message: "Ongeldige inloggegevens" };
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
     Logout (verwijdert HttpOnly cookie)
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
     Waarden
  ------------------------------------------------------- */
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    fetchWithAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
