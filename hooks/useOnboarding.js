"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios"; // jouw axios-instance

/**
 * 🧠 useOnboarding()
 * - Haalt onboarding status op
 * - Markeer stappen als voltooid
 * - Bepaalt of gebruiker dashboard mag zien
 */

export default function useOnboarding() {
  const [steps, setSteps] = useState({
    setup: false,
    technical: false,
    macro: false,
    market: false,
    strategy: false,
    finished: false,
  });

  const [loading, setLoading] = useState(true);
  const [savingStep, setSavingStep] = useState(false);
  const [error, setError] = useState(null);

  // ------------------------------
  // 🔵 1. Laad onboarding status bij mount
  // ------------------------------
  useEffect(() => {
    let mounted = true;

    async function fetchStatus() {
      try {
        setLoading(true);
        const res = await axios.get("/api/onboarding/status");

        if (mounted) {
          setSteps({
            setup: res.data.setup || false,
            technical: res.data.technical || false,
            macro: res.data.macro || false,
            market: res.data.market || false,
            strategy: res.data.strategy || false,
            finished: res.data.finished || false,
          });
        }
      } catch (err) {
        console.error("❌ Onboarding status load failed:", err);
        if (mounted) setError("Kon onboarding-status niet laden.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchStatus();
    return () => (mounted = false);
  }, []);

  // ------------------------------
  // 🔵 2. Onboarding-stap afronden
  // ------------------------------
  async function completeStep(stepName) {
    try {
      setSavingStep(true);
      await axios.post("/api/onboarding/complete_step", { step: stepName });

      // Update local state zodat UI direct reageert
      setSteps((prev) => {
        const updated = { ...prev, [stepName]: true };

        // Als alle stappen true → finished = true
        const allDone =
          updated.setup &&
          updated.technical &&
          updated.macro &&
          updated.market &&
          updated.strategy;

        return { ...updated, finished: allDone };
      });

      return true;
    } catch (err) {
      console.error("❌ Failed to complete onboarding step:", err);
      setError("Kon stap niet opslaan.");
      return false;
    } finally {
      setSavingStep(false);
    }
  }

  // ------------------------------
  // 🔵 3. Mag gebruiker dashboard zien?
  // ------------------------------
  const isOnboardingComplete = steps.finished === true;

  return {
    loading,
    error,
    steps,
    completeStep,
    savingStep,
    isOnboardingComplete,
  };
}
