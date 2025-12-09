"use client";

import { useState } from "react";

// 🔥 Onboarding banner toevoegen
import OnboardingBanner from "@/components/onboarding/OnboardingBanner";

import { useMacroData } from "@/hooks/useMacroData";
import { useScoresData } from "@/hooks/useScoresData";

import MacroTabs from "@/components/macro/MacroTabs";
import MacroIndicatorScoreView from "@/components/macro/MacroIndicatorScoreView";

import CardWrapper from "@/components/ui/CardWrapper";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

import { Globe, Brain, Activity } from "lucide-react";

export default function MacroPage() {
  const [activeTab, setActiveTab] = useState("Dag");

  const {
    macroData,
    handleRemove,
    loading: loadingIndicators,
    error,
  } = useMacroData(activeTab);

  const { macro, loading: loadingScore } = useScoresData();

  // -------------------------------------------------------
  // 🛡️ Safe fallback macro object (crash prevention)
  // -------------------------------------------------------
  const safeMacro = {
    score: macro?.score ?? null,
    trend: macro?.trend ?? "Onbekend",
    bias: macro?.bias ?? "Neutraal",
    risk: macro?.risk ?? "Onbekend",
    summary:
      macro?.summary ??
      "Nog geen macro-inzichten beschikbaar. Voeg indicatoren toe of wacht op de eerste AI-run.",
  };

  // -------------------------------------------------------
  // Score kleur
  // -------------------------------------------------------
  const getScoreColor = (score) => {
    const n = typeof score === "number" ? score : Number(score);
    if (isNaN(n)) return "text-[var(--text-light)]";

    if (n >= 80) return "score-strong-buy";
    if (n >= 60) return "score-buy";
    if (n >= 40) return "score-neutral";
    if (n >= 20) return "score-sell";
    return "score-strong-sell";
  };

  // -------------------------------------------------------
  // Advies
  // -------------------------------------------------------
  const adviesText =
    (safeMacro.score ?? 0) >= 75
      ? "Positief"
      : (safeMacro.score ?? 0) <= 25
      ? "Negatief"
      : "Neutraal";

  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* 🔥 Onboarding stap 3 banner */}
      <OnboardingBanner step="macro" />

      <div className="flex items-center gap-3">
        <Globe size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)] tracking-tight">
          Macro Analyse
        </h1>
      </div>

      <AgentInsightPanel category="macro" />

      <CardWrapper>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Brain className="text-purple-600" size={20} />
            <h2 className="text-lg font-semibold text-[var(--text-dark)]">
              Totale Macro Score
            </h2>
          </div>

          <div className="text-xl font-bold flex items-center gap-3">
            {loadingScore ? (
              <span className="text-[var(--text-light)]">⏳</span>
            ) : (
              <span className={getScoreColor(safeMacro.score)}>
                {safeMacro.score ?? "–"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-lg">
            <Activity className="text-blue-500" size={20} />
            <span className="font-semibold">
              Advies:{" "}
              {loadingScore ? (
                <span className="text-[var(--text-light)]">⏳</span>
              ) : (
                <span
                  className={
                    adviesText === "Positief"
                      ? "text-green-600"
                      : adviesText === "Negatief"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {adviesText}
                </span>
              )}
            </span>
          </div>
        </div>
      </CardWrapper>

      <MacroIndicatorScoreView />

      <MacroTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        macroData={macroData}
        loading={loadingIndicators}
        error={error}
        handleRemove={handleRemove}
      />
    </div>
  );
}
