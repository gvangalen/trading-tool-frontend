"use client";

import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * 🧠 useOnboarding
 *
 * Let op:
 *  - Gebruikt nu cookie-auth via fetchWithAuth
 *  - Geen Bearer tokens / fetchAuth meer
 */
export function useOnboarding() {
  const { isAuthenticated, fetchWithAuth } = useAuth();

  const [status, setStatus] = useState<any>(null);
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

      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/onboarding/status`
      );

      if (!res.ok) {
        console.error(
          "❌ Failed to load onboarding status:",
          res.status,
          await res.text().catch(() => "")
        );
        return;
      }

      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("❌ Failed to load onboarding status:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchWithAuth]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // ======================================
  // 2️⃣ Helper voor POST-acties
  // ======================================
  const postStep = useCallback(
    async (url: string, body?: any) => {
      if (!isAuthenticated) return;

      try {
        setSaving(true);

        const res = await fetchWithAuth(`${API_BASE_URL}${url}`, {
          method: "POST",
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
          console.error(
            "❌ Onboarding POST error:",
            url,
            res.status,
            await res.text().catch(() => "")
          );
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
  const completeStep = (step: string) =>
    postStep("/api/onboarding/complete_step", { step });

  const finish = () => postStep("/api/onboarding/finish");

  const reset = () => postStep("/api/onboarding/reset");

  // ======================================
  // 4️⃣ Flags
  // ======================================
  const completed =
    !!status?.has_setup &&
    !!status?.has_technical &&
    !!status?.has_macro &&
    !!status?.has_market &&
    !!status?.has_strategy;

  return {
    status,
    loading,
    saving,
    authenticated: isAuthenticated,
    completed,
    completeStep,
    finish,
    reset,
    refresh: fetchStatus,
  };
}
