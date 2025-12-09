"use client";

import Link from "next/link";
import { useOnboarding } from "@/hooks/useOnboarding";

/**
 * OnboardingBanner component
 * - step: "setup" | "technical" | "macro" | "market" | "strategy"
 */

const STEP_TEXT = {
  setup: {
    title: "Stap 1 van 5 – Setup aanmaken",
    action: "Maak minstens één setup aan om deze stap af te ronden.",
  },
  technical: {
    title: "Stap 2 van 5 – Technische indicatoren",
    action: "Voeg minimaal één technische indicator toe.",
  },
  macro: {
    title: "Stap 3 van 5 – Macro indicatoren",
    action: "Voeg minimaal één macro-indicator toe.",
  },
  market: {
    title: "Stap 4 van 5 – Market data",
    action: "De tool vult dit automatisch in, maar moet een eerste run doen.",
  },
  strategy: {
    title: "Stap 5 van 5 – Strategie genereren",
    action: "Genereer minstens één strategie voor jouw setup.",
  },
};

export default function OnboardingBanner({ step }) {
  const { status, loading, completed } = useOnboarding();

  // Nog geen data → geen banner
  if (loading || !status) return null;

  // Onboarding is al klaar → banner verbergen
  if (completed) return null;

  const done = status?.[`has_${step}`];

  // Als deze stap al klaar is → ook geen banner
  if (done) return null;

  const conf = STEP_TEXT[step];

  return (
    <div className="p-4 mb-6 bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm">
      <h3 className="font-semibold text-yellow-800">{conf.title}</h3>
      <p className="text-sm text-yellow-700 mt-1">{conf.action}</p>

      <div className="mt-3">
        <Link
          href="/onboarding"
          className="inline-block px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          ← Terug naar Onboarding
        </Link>
      </div>
    </div>
  );
}
