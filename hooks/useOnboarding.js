"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import {
  getOnboardingStatus,
  completeOnboardingStep,
  finishOnboarding,
  resetOnboarding,
} from "@/lib/api/onboarding";

/**
 * =====================================================
 * 🧭 useOnboarding (OFFICIËLE VERSIE)
 * - Praat ALLEEN met lib/api/onboarding
 * - Pipeline-aware
 * - Consistent met Macro / Market / Technical
 * =====================================================
 */
export function useOnboarding() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // =====================================================
  // 1️⃣ Status ophalen
  // =====================================================
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getOnboardingStatus();
      setStatus(data);

    } catch (err) {
      console.error("❌ Failed to load onboarding status:", err);
      setError("Kon onboarding-status niet laden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // =====================================================
  // 2️⃣ Acties
  // =====================================================
  const completeStep = async (step) => {
    try {
      setSaving(true);
      setError(null);

      await completeOnboardingStep(step);
      await fetchStatus();

    } catch (err) {
      console.error(`❌ Complete step failed (${step}):`, err);
      setError("Stap kon niet worden voltooid.");
    } finally {
      setSaving(false);
    }
  };

  const finish = async () => {
    try {
      setSaving(true);
      setError(null);

      await finishOnboarding();
      await fetchStatus();

    } catch (err) {
      console.error("❌ Finish onboarding failed:", err);
      setError("Onboarding afronden mislukt.");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    try {
      setSaving(true);
      setError(null);

      await resetOnboarding();
      await fetchStatus();

    } catch (err) {
      console.error("❌ Reset onboarding failed:", err);
      setError("Onboarding reset mislukt.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // 3️⃣ Stap-status
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
  // 4️⃣ Onboarding & pipeline status
  // =====================================================
  const onboardingComplete = useMemo(() => {
    if (!stepStatus) return false;
    return Object.values(stepStatus).every(Boolean);
  }, [stepStatus]);

  const pipelineStarted = !!status?.pipeline_started;

  const pipelineRunning =
    onboardingComplete && !pipelineStarted;

  const dashboardReady =
    onboardingComplete && pipelineStarted;

  // =====================================================
  // 5️⃣ Unlock logic (volgorde)
  // =====================================================
  const allowedSteps = {
    market: true,
    macro: stepStatus?.market ?? false,
    technical: stepStatus?.macro ?? false,
    setup: stepStatus?.technical ?? false,
    strategy: stepStatus?.setup ?? false,
  };

  // =====================================================
  // 6️⃣ Export
  // =====================================================
  return {
    status,
    stepStatus,

    loading,
    saving,
    error,

    onboardingComplete,
    pipelineStarted,
    pipelineRunning,
    dashboardReady,

    allowedSteps,

    completeStep,
    finish,
    reset,
    refresh: fetchStatus,
  };
}
