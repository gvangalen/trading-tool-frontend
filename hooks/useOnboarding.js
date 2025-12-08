"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAuth } from "@/lib/api/auth";

/**
 * 🧠 useOnboarding
 *
 * Let op:
 *  - Onboarding mag ALLEEN worden geladen als user is ingelogd.
 */
export function useOnboarding() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // ======================================
  // 1️⃣ Eerst checken of user is ingelogd
  // ======================================
  const checkAuth = useCallback(async () => {
    try {
      const me = await fetchAuth("/api/auth/me");
      if (me && me.id) {
        setAuthenticated(true);
      }
    } catch (err) {
      // Niet ingelogd → geen fouten gooien
      setAuthenticated(false);
    }
  }, []);

  // ======================================
  // 2️⃣ Onboarding status ophalen
  // ======================================
  const fetchStatus = useCallback(async () => {
    if (!authenticated) {
      // ⛔ Niet proberen indien user NIET ingelogd is
      return;
    }

    try {
      setLoading(true);
      const res = await fetchAuth("/api/onboarding/status");
      setStatus(res);
    } catch (err) {
      console.error("❌ Failed to load onboarding status:", err);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  // ======================================
  // Start: eerst auth checken → daarna status
  // ======================================
  useEffect(() => {
    checkAuth().then(() => {
      if (authenticated) {
        fetchStatus();
      }
    });
  }, [checkAuth, fetchStatus, authenticated]);

  // ======================================
  // 3️⃣ Step complete
  // ======================================
  const completeStep = async (step) => {
    if (!authenticated) return;

    try {
      setSaving(true);
      await fetchAuth("/api/onboarding/complete_step", {
        method: "POST",
        body: JSON.stringify({ step }),
      });
      await fetchStatus();
    } catch (err) {
      console.error(`❌ Failed to complete onboarding step: ${step}`, err);
    } finally {
      setSaving(false);
    }
  };

  // Finish onboarding
  const finish = async () => {
    if (!authenticated) return;

    try {
      setSaving(true);
      await fetchAuth("/api/onboarding/finish", { method: "POST" });
      await fetchStatus();
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!authenticated) return;

    try {
      setSaving(true);
      await fetchAuth("/api/onboarding/reset", { method: "POST" });
      await fetchStatus();
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // Flags
  // ======================================
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
    authenticated,
    completed,
    completeStep,
    finish,
    reset,
    refresh: fetchStatus,
  };
}
