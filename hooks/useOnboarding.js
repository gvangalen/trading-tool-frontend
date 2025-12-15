"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * =====================================================
 * 🧭 useOnboarding
 * - Volledige onboarding state
 * - Pipeline-aware (Celery)
 * - Dashboard-safe
 * =====================================================
 */
export function useOnboarding() {
  const { isAuthenticated, fetchWithAuth } = useAuth();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // =====================================================
  // 1️⃣ Status ophalen
  // =====================================================
  const fetchStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setStatus(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/onboarding/status`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setStatus(data);

    } catch (err) {
      console.error("❌ Failed to load onboarding status:", err);
      setError("Kon onboarding-status niet laden.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchWithAuth]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // =====================================================
  // 2️⃣ POST helper
  // =====================================================
  const postStep = useCallback(
    async (url: string, body?: Record<string, any>) => {
      if (!isAuthenticated) return;

      try {
        setSaving(true);
        setError(null);

        const res = await fetchWithAuth(`${API_BASE_URL}${url}`, {
          method: "POST",
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
          throw new Error(`POST ${url} failed`);
        }

        await fetchStatus();
      } catch (err) {
        console.error("❌ Onboarding POST error:", url, err);
        setError("Actie kon niet worden uitgevoerd.");
      } finally {
        setSaving(false);
      }
    },
    [isAuthenticated, fetchWithAuth, fetchStatus]
  );

  // =====================================================
  // 3️⃣ Acties
  // =====================================================
  const completeStep = (step: string) =>
    postStep("/api/onboarding/complete_step", { step });

  const finish = () =>
    postStep("/api/onboarding/finish");

  const reset = () =>
    postStep("/api/onboarding/reset");

  // =====================================================
  // 4️⃣ Stap-status
  // =====================================================
  const stepStatus = useMemo(() => {
    if (!status) return null;

    return {
      market: !!status.has_market,
      macro: !!status.has_macro,
      technical: !!status.has_technical,
      setup: !!status.has_setup,
      strategy: !!status.has_strategy,
    };
  }, [status]);

  // =====================================================
  // 5️⃣ Onboarding voltooid?
  // =====================================================
  const onboardingComplete = useMemo(() => {
    if (!stepStatus) return false;
    return Object.values(stepStatus).every(Boolean);
  }, [stepStatus]);

  // =====================================================
  // 6️⃣ Pipeline status (🔥 BELANGRIJK)
  // =====================================================
  const pipelineStarted = !!status?.pipeline_started;

  /**
   * Dashboard is pas "ready" als:
   * - onboarding voltooid
   * - pipeline gestart
   */
  const dashboardReady =
    onboardingComplete && pipelineStarted;

  /**
   * Onboarding klaar maar AI nog bezig
   */
  const pipelineRunning =
    onboardingComplete && !pipelineStarted;

  // =====================================================
  // 7️⃣ Unlock logic (volgorde afdwingen)
  // =====================================================
  const allowedSteps = {
    market: true,
    macro: stepStatus?.market ?? false,
    technical: stepStatus?.macro ?? false,
    setup: stepStatus?.technical ?? false,
    strategy: stepStatus?.setup ?? false,
  };

  // =====================================================
  // 8️⃣ Exposed API
  // =====================================================
  return {
    // raw
    status,
    stepStatus,

    // loading states
    loading,
    saving,
    error,

    // auth
    authenticated: isAuthenticated,

    // onboarding states
    onboardingComplete,
    pipelineStarted,
    pipelineRunning,
    dashboardReady,

    // flow control
    allowedSteps,

    // actions
    completeStep,
    finish,
    reset,
    refresh: fetchStatus,
  };
}
