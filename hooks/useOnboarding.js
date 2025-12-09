"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * useOnboarding — enhanced with:
 * ✅ automatic redirect to /onboarding/complete
 * ✅ step unlock logic (market → macro → technical → setup → strategy)
 */
export function useOnboarding() {
  const router = useRouter();
  const { isAuthenticated, fetchWithAuth } = useAuth();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ======================================
  // 1️⃣ Status ophalen
  // ======================================
  const fetchStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setStatus(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetchWithAuth(`${API_BASE_URL}/api/onboarding/status`);

      if (!res.ok) {
        console.error("❌ Failed to load onboarding status:", res.status);
        return;
      }

      const data = await res.json();
      setStatus(data);

      // ======================================
      // ⭐ AUTO-REDIRECT wanneer onboarding klaar is
      // ======================================
      const allDone =
        data?.has_market &&
        data?.has_macro &&
        data?.has_technical &&
        data?.has_setup &&
        data?.has_strategy;

      if (allDone) {
        router.push("/onboarding/complete");
      }

    } catch (err) {
      console.error("❌ Failed to load onboarding status:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchWithAuth, router]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // ======================================
  // 2️⃣ POST helper
  // ======================================
  const postStep = useCallback(
    async (url, body) => {
      if (!isAuthenticated) return;

      try {
        setSaving(true);

        const res = await fetchWithAuth(`${API_BASE_URL}${url}`, {
          method: "POST",
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
          console.error("❌ Onboarding POST error:", url);
        }

        await fetchStatus();
      } catch (err) {
        console.error("❌ Onboarding POST error:", url, err);
      } finally {
        setSaving(false);
      }
    },
    [isAuthenticated, fetchWithAuth, fetchStatus]
  );

  // ======================================
  // 3️⃣ Acties
  // ======================================
  const completeStep = (step) =>
    postStep("/api/onboarding/complete_step", { step });

  const finish = () => postStep("/api/onboarding/finish");

  const reset = () => postStep("/api/onboarding/reset");

  // ======================================
  // 4️⃣ Complete flag
  // ======================================
  const completed =
    !!status?.has_market &&
    !!status?.has_macro &&
    !!status?.has_technical &&
    !!status?.has_setup &&
    !!status?.has_strategy;

  // ======================================
  // 5️⃣ Stap-volgorde / unlock logic
  // ======================================

  const allowedSteps = {
    market: true,
    macro: !!status?.has_market,
    technical: !!status?.has_macro,
    setup: !!status?.has_technical,
    strategy: !!status?.has_setup,
  };

  return {
    status,
    loading,
    saving,
    authenticated: isAuthenticated,
    completed,
    allowedSteps,      // ⭐ nieuw
    completeStep,
    finish,
    reset,
    refresh: fetchStatus,
  };
}
