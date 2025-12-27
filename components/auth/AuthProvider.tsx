"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/lib/config";
import {
  saveUserLocal,
  loadUserLocal,
  clearUserLocal,
} from "@/lib/api/user";

/* ===========================================================
   CONTEXT
=========================================================== */
const AuthContext = createContext<any>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ===========================================================
   fetchWithAuth — cookies + JSON
=========================================================== */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  return fetch(url, {
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
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<any>(loadUserLocal());
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     1️⃣ SESSION LADEN (/me)
  ------------------------------------------------------- */
  const loadSession = useCallback(async () => {
    try {
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
     2️⃣ TOKEN REFRESH (ongewijzigd)
  ------------------------------------------------------- */
  useEffect(() => {
    const intv = setInterval(async () => {
      try {
        await fetchWithAuth(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
        });
      } catch (err) {
        console.error("❌ Refresh fout:", err);
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(intv);
  }, []);

  /* -------------------------------------------------------
     3️⃣ LOGIN — SNEL & ZONDER RELOAD
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
      const u = data.user;

      // ✅ state direct updaten
      setUser(u);
      saveUserLocal(u);

      // ✅ routing via Next (middleware beslist eindroute)
      router.replace("/");

      return { success: true };
    } catch (err) {
      console.error("❌ Login fout:", err);
      return { success: false, message: "Serverfout" };
    }
  }, [router]);

  /* -------------------------------------------------------
     4️⃣ LOGOUT — DIRECT UI, DAN SERVER
  ------------------------------------------------------- */
  const logout = useCallback(async () => {
    // 🔥 UI eerst → instant
    setUser(null);
    clearUserLocal();

    // server call mag async
    try {
      await fetchWithAuth(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.error("❌ Logout fout:", err);
    }

    router.replace("/login");
  }, [router]);

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
