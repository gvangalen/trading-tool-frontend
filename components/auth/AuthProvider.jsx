"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { API_BASE_URL } from "@/lib/config";
import { useModal } from "@/components/modal/ModalProvider";

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
  const [user, setUser] = useState(null); // { id, email, role, first_name, last_name }
  const [loading, setLoading] = useState(true);

  const { showSnackbar } = useModal();

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
        const body = await res.json().catch(() => null);
        return {
          success: false,
          message: body?.detail || "Ongeldige inloggegevens",
        };
      }

      const data = await res.json();
      // backend stuurt { success, user: {...} }
      setUser(data.user || data);

      return { success: true };
    } catch (err) {
      console.error("❌ Login fout:", err);
      return { success: false, message: "Serverfout" };
    }
  }, []);

  /* -------------------------------------------------------
     4) REGISTER
  ------------------------------------------------------- */
  const registerUser = useCallback(
    async (firstName, lastName, email, password) => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName || null,
            email,
            password,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          return {
            success: false,
            message: body?.detail || "Registratie mislukt",
          };
        }

        return { success: true };
      } catch (err) {
        console.error("❌ Register fout:", err);
        return { success: false, message: "Serverfout" };
      }
    },
    []
  );

  /* -------------------------------------------------------
     5) LOGOUT — FIXED VERSION
  ------------------------------------------------------- */
  const logout = useCallback(() => {
    // We doen fetch, maar we laten errors niet meer "lekken"
    fetchWithAuth(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
    }).catch((err) => {
      console.error("❌ Logout fout:", err);
    });

    // Session leegmaken
    setUser(null);

    // Snackbar feedback
    showSnackbar("Je bent veilig uitgelogd ✔", "success");

    // Hard redirect zodat alles clean is
    window.location.href = "/login";
  }, [showSnackbar]);

  /* -------------------------------------------------------
     Output
  ------------------------------------------------------- */
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    registerUser,
    fetchWithAuth,
    reload: loadSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
