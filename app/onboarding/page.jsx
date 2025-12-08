"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

import CardWrapper from "@/components/ui/CardWrapper";
import { fetchAuth } from "@/lib/api/auth"; // voor /api/onboarding/status

export default function OnboardingPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // 📡 Haal onboarding status op
  // ============================
  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetchAuth("/api/onboarding/status");
        setStatus(res);
      } catch (err) {
        console.error("Onboarding status error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  if (loading || !status) {
    return (
      <div className="max-w-screen-md mx-auto py-10 px-4 text-center">
        <p className="text-gray-500">Onboarding wordt geladen…</p>
      </div>
    );
  }

  // ============================
  // 🧠 Stappen bepalen (6 steps)
  // ============================

  const steps = [
    {
      key: "setup",
      title: "Setup aanmaken",
      description: "Maak jouw eerste trading setup aan.",
      done: status.has_setup,
      link: "/setups",
    },
    {
      key: "technical",
      title: "Technische indicatoren",
      description: "Voeg technische indicatoren toe (RSI, MA, Volume…).",
      done: status.has_technical,
      link: "/technical",
    },
    {
      key: "macro",
      title: "Macro indicatoren",
      description: "Voeg macrodata toe zoals DXY, F&G Index, BTC Dominantie.",
      done: status.has_macro,
      link: "/macro",
    },
    {
      key: "market",
      title: "Market indicatoren",
      description: "Selecteer marktindicatoren zoals prijs, volume, volatiliteit.",
      done: status.has_market,
      link: "/market",
    },
    {
      key: "strategy",
      title: "Strategie genereren",
      description: "Genereer AI-strategie voor je setup.",
      done: status.has_strategy,
      link: "/strategies",
    },
    {
      key: "complete",
      title: "Onboarding afronden",
      description: "Alle stappen voltooid → dashboard activeren.",
      done:
        status.has_setup &&
        status.has_technical &&
        status.has_macro &&
        status.has_market &&
        status.has_strategy,
      link: "/dashboard",
    },
  ];

  const onboardingComplete = steps[5].done;

  return (
    <div className="max-w-screen-md mx-auto py-12 px-6 space-y-8 animate-fade-slide">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-dark)]">
          🚀 Onboarding
        </h1>
        <p className="text-[var(--text-light)] mt-2">
          Voltooi de stappen hieronder om jouw persoonlijke tradingdashboard te activeren.
        </p>
      </div>

      {/* Stappenlijst */}
      <CardWrapper>
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-dark)]">
          Jouw voortgang
        </h2>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <StepRow key={index} step={step} />
          ))}
        </div>
      </CardWrapper>

      {/* Dashboard knop */}
      {onboardingComplete && (
        <CardWrapper>
          <div className="text-center">
            <p className="mb-4 text-[var(--text-dark)] font-medium">
              🎉 Je onboarding is voltooid!
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg shadow hover:bg-[var(--primary-strong)] transition"
            >
              Naar Dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </CardWrapper>
      )}
    </div>
  );
}

/* ============================================================
   ROW COMPONENT — ieder onboarding item
============================================================ */
function StepRow({ step }) {
  return (
    <div className="flex items-start gap-4 p-4 border border-[var(--card-border)] rounded-lg bg-white shadow-sm">
      {/* Status icoon */}
      <div>
        {step.done ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <Circle className="w-6 h-6 text-gray-300" />
        )}
      </div>

      {/* Tekst */}
      <div className="flex-1">
        <h3 className="font-semibold text-[var(--text-dark)]">
          {step.title}
        </h3>
        <p className="text-[var(--text-light)] text-sm">{step.description}</p>
      </div>

      {/* Actie */}
      <div>
        <a
          href={step.link}
          className="
            px-4 py-2 rounded-lg text-sm border
            border-[var(--primary)]
            text-[var(--primary)]
            hover:bg-[var(--primary)] hover:text-white
            transition
          "
        >
          {step.done ? "Bekijken" : "Starten"}
        </a>
      </div>
    </div>
  );
}
