"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAuth } from "@/lib/api/auth";

/**
 * 🧠 useOnboarding
 *
 * Praat met de backend endpoints:
 *  - GET  /api/onboarding/status
 *  - POST /api/onboarding/complete_step
 *  - POST /api/onboarding/finish
 *  - POST /api/onboarding/reset   (dev/test)
 */
export function useOnboarding() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ============================
  // 📡 1) Status ophalen
  // ============================
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);

      // fetchAuth geeft direct de JSON terug (geen res.data)
      const res = await fetchAuth("/api/onboarding/status");
      setStatus(res);
    } catch (err) {
      console.error("❌ Failed to load onboarding status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // ============================
  // ✔ 2) Stap afronden
  // ============================
  const completeStep = async (step) => {
    try {
      setSaving(true);

      await fetchAuth("/api/onboarding/complete_step", {
        method: "POST",
        body: JSON.stringify({ step }),
      });

      // Daarna status opnieuw ophalen
      await fetchStatus();
    } catch (err) {
      console.error(`❌ Failed to complete onboarding step: ${step}`, err);
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // 🚀 3) Onboarding afronden
  // ============================
  const finish = async () => {
    try {
      setSaving(true);

      await fetchAuth("/api/onboarding/finish", {
        method: "POST",
      });

      await fetchStatus();
    } catch (err) {
      console.error("❌ Failed to finish onboarding", err);
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // 🔄 4) Reset (dev / testen)
  // ============================
  const reset = async () => {
    try {
      setSaving(true);

      await fetchAuth("/api/onboarding/reset", {
        method: "POST",
      });

      await fetchStatus();
    } catch (err) {
      console.error("❌ Failed to reset onboarding", err);
    } finally {
      setSaving(false);
    }
  };

  // Handy flags
  const completed =
    status?.has_setup &&
    status?.has_technical &&
    status?.has_macro &&
    status?.has_market &&
    status?.has_strategy;

  return {
    status,
    loading,
    saving,
    completed,
    completeStep,
    finish,
    reset,
    refresh: fetchStatus,
  };
}
