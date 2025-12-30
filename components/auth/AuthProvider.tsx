"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { API_BASE_URL } from "@/lib/config";
import {
  saveUserLocal,
  loadUserLocal,
  clearUserLocal,
} from "@/lib/api/user";

/* ===========================================================
   CONTEXT
=========================================================== */
const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

/* ===========================================================
   fetchWithAuth
=========================================================== */
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });
}


/* ===========================================================
   AUTH PROVIDER
=========================================================== */
export function AuthProvider({ children }) {
  // 👉 localStorage is alleen een hint
  const initialUser = loadUserLocal() ?? null;

  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);

  const didInit = useRef(false);
  const sessionInFlight = useRef(false);
  const abortRef = useRef(null);

  /* -------------------------------------------------------
     SESSION CHECK (/me)
  ------------------------------------------------------- */
  const loadSession = useCallback(async () => {
    if (sessionInFlight.current) return;
    sessionInFlight.current = true;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      if (res.ok) {
        const u = await res.json();
        setUser(u);
        saveUserLocal(u);
      } else {
        // ❌ Niet ingelogd
        setUser(null);
        clearUserLocal();
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("❌ Auth /me error:", err);
        // ❌ Bij fout: geen half-auth state
        setUser(null);
        clearUserLocal();
      }
    } finally {
      sessionInFlight.current = false;
      setLoading(false);
    }
  }, []);

  /* -------------------------------------------------------
     INIT (1x)
  ------------------------------------------------------- */
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    loadSession();

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [loadSession]);

  /* -------------------------------------------------------
     TOKEN REFRESH (veilig)
  ------------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetchWithAuth(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
        });
      } catch {
        // stil — refresh mag falen zonder redirect storm
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /* -------------------------------------------------------
     LOGIN
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
      const u = data.user;

      setUser(u);
      saveUserLocal(u);

      return { success: true };
    } catch (err) {
      console.error("❌ Login fout:", err);
      return {
        success: false,
        message: "Serverfout",
      };
    }
  }, []);

  /* -------------------------------------------------------
     LOGOUT
  ------------------------------------------------------- */
  const logout = useCallback(async () => {
    setUser(null);
    clearUserLocal();

    try {
      await fetchWithAuth(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
    } catch {
      /* stil */
    }
  }, []);

  /* -------------------------------------------------------
     CONTEXT VALUE
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
