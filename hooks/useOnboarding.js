"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAuth } from "@/lib/api/auth";

/**
 * 🧠 useOnboarding — JWT correct + race condition fix
 */
export function useOnboarding() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // -----------------------------------------------------
  // 1️⃣ Check of user is ingelogd (via backend cookies)
  // -----------------------------------------------------
  const checkAuth = useCallback(async () => {
    try {
      const me = await fetchAuth("/api/auth/me");

      if (me && me.id) {
        setAuthenticated(true);
        return true;
      }
    } catch (err) {
      console.warn("User is not authenticated.");
    }

    setAuthenticated(false);
    return false;
  }, []);

  // -----------------------------------------------------
  // 2️⃣ Onboarding status ophalen
  // -----------------------------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAuth("/api/onboarding/status");
      setStatus(res);
    } catch (err) {
      console.error("❌ Failed to load onboarding status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------------------------------
  // 🔄 3️⃣ Start: eerst auth check → daarna ONBOARDING
  // -----------------------------------------------------
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 🔄 Wanneer authenticated verandert → status ophalen
  useEffect(() => {
    if (authenticated) {
      fetchStatus();
    }
  }, [authenticated, fetchStatus]);

  // -----------------------------------------------------
  // 4️⃣ Actions
  // -----------------------------------------------------
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

  // -----------------------------------------------------
  // 5️⃣ Flags
  // -----------------------------------------------------
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
