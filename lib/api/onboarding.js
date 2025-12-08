"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getOnboardingStatus,
  completeOnboardingStep,
  finishOnboarding,
  resetOnboarding,
} from "@/lib/api/onboarding";

/**
 * -----------------------------------------------------
 * 🔥 useOnboarding Hook
 * - Haalt onboarding progress op
 * - Houdt status bij
 * - Biedt functies voor completeStep(), finish() en reset()
 * -----------------------------------------------------
 */

export default function useOnboarding() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * =====================================
   * 🔄 STATUS LADEN
   * =====================================
   */
  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOnboardingStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      console.error("❌ Fout bij laden onboarding status:", err);
      setError("Kon onboarding-status niet laden.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Auto load bij init
   */
  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  /**
   * =====================================
   * ✔ STAP VOLTOOIEN
   * complete("setup")
   * complete("technical")
   * complete("macro")
   * complete("market")
   * complete("strategy")
   * =====================================
   */
  async function complete(step) {
    try {
      setUpdating(true);
      await completeOnboardingStep(step);
      await loadStatus();
    } catch (err) {
      console.error(`❌ Kon stap '${step}' niet voltooien:`, err);
      setError(`Stap '${step}' kon niet worden voltooid.`);
    } finally {
      setUpdating(false);
    }
  }

  /**
   * =====================================
   * 🏁 ONBOARDING AFRONDEN
   * =====================================
   */
  async function finish() {
    try {
      setUpdating(true);
      await finishOnboarding();
      await loadStatus();
    } catch (err) {
      console.error("❌ Kon onboarding niet afronden:", err);
      setError("Kon onboarding niet afronden.");
    } finally {
      setUpdating(false);
    }
  }

  /**
   * =====================================
   * 🔄 RESET (alleen DEV / testen)
   * =====================================
   */
  async function reset() {
    try {
      setUpdating(true);
      await resetOnboarding();
      await loadStatus();
    } catch (err) {
      console.error("❌ Kon onboarding niet resetten:", err);
      setError("Kon onboarding niet resetten.");
    } finally {
      setUpdating(false);
    }
  }

  return {
    status,        // status.setup / status.macro / status.completed, etc.
    loading,       // init loading
    updating,      // true wanneer backend iets verwerkt
    error,         // eventuele foutmelding

    complete,      // complete("setup")
    finish,        // finish()
    reset,         // reset()
    reload: loadStatus, // handmatig opnieuw laden
  };
}
