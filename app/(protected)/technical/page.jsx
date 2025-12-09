"use client";

import { useState } from "react";

import { TrendingUp, Brain, Activity, Info } from "lucide-react";

import { useTechnicalData } from "@/hooks/useTechnicalData";
import { useScoresData } from "@/hooks/useScoresData";
import { useOnboarding } from "@/hooks/useOnboarding";

import TechnicalTabs from "@/components/technical/TechnicalTabs";
import TechnicalIndicatorScoreView from "@/components/technical/TechnicalIndicatorScoreView";

import CardWrapper from "@/components/ui/CardWrapper";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

export default function TechnicalPage() {
  const [activeTab, setActiveTab] = useState("Dag");

  const {
    technicalData,
    removeTechnicalIndicator,
    loading: loadingIndicators,
    error,
  } = useTechnicalData(activeTab);

  const { technical, loading: loadingScore } = useScoresData();

  // 🔥 Onboarding hook
  const { status, loading: onboardingLoading } = useOnboarding();

  // Bepaal of onboarding nog niet klaar is
  const onboardingActive =
    !onboardingLoading &&
    status &&
    (!status.has_setup ||
      !status.has_technical ||
      !status.has_macro ||
      !status.has_market ||
      !status.has_strategy);

  /* =====================================================
     SAFE FALLBACK VOOR NIEUWE GEBRUIKER
  ===================================================== */
  const safeTechnical = {
    score: technical?.score ?? null,
    trend: technical?.trend ?? "Onbekend",
    bias: technical?.bias ?? "Neutraal",
    risk: technical?.risk ?? "Onbekend",
    summary:
      technical?.summary ??
      "Nog geen technische AI-inzichten beschikbaar. Voeg indicatoren toe of wacht op de eerste AI-run.",
  };

  /* =====================================================
     SCORE → kleurklasse
  ===================================================== */
  const getScoreColor = (score) => {
    const n = typeof score === "number" ? score : Number(score);
    if (isNaN(n)) return "text-[var(--text-light)]";

    if (n >= 80) return "score-strong-buy";
    if (n >= 60) return "score-buy";
    if (n >= 40) return "score-neutral";
    if (n >= 20) return "score-sell";
    return "score-strong-sell";
  };

  /* =====================================================
     ADVIES TEKST
  ===================================================== */
  const adviesText =
    (safeTechnical.score ?? 0) >= 75
      ? "Positief"
      : (safeTechnical.score ?? 0) <= 25
      ? "Negatief"
      : "Neutraal";

  /* =====================================================
     PAGE RENDER
  ===================================================== */
  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* -------------------------------------------------- */}
      {/* 🚀 ONBOARDING-BANNER */}
      {/* -------------------------------------------------- */}
      {onboardingActive && (
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="text-yellow-600 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-yellow-800">
                Onboarding nog niet voltooid
              </h3>
              <p className="text-sm text-yellow-700">
                Je moet nog stappen afronden om je trading dashboard te activeren.
              </p>
            </div>
          </div>

          <a
            href="/onboarding"
            className="
              px-4 py-2 rounded-lg text-sm 
              bg-yellow-600 text-white 
              hover:bg-yellow-700 transition
            "
          >
            Verder met onboarding
          </a>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* PAGE TITLE */}
      {/* -------------------------------------------------- */}
      <div className="flex items-center gap-3">
        <TrendingUp size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)] tracking-tight">
          Technische Analyse
        </h1>
      </div>

      {/* -------------------------------------------------- */}
      {/* AI SAMENVATTING */}
      {/* -------------------------------------------------- */}
      <AgentInsightPanel category="technical" />

      {/* -------------------------------------------------- */}
      {/* TOTALE TECHNICAL SCORE */}
      {/* -------------------------------------------------- */}
      <CardWrapper>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Brain className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-[var(--text-dark)]">
              Totale Technical Score
            </h2>
          </div>

          <div className="text-xl font-bold flex items-center gap-3">
            {loadingScore ? (
              <span className="text-[var(--text-light)]">⏳</span>
            ) : (
              <span className={getScoreColor(safeTechnical.score)}>
                {safeTechnical.score ?? "–"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-lg">
            <Activity className="text-purple-500" size={20} />
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

      {/* -------------------------------------------------- */}
      {/* SCORE-REGEL VIEWER */}
      {/* -------------------------------------------------- */}
      <TechnicalIndicatorScoreView />

      {/* -------------------------------------------------- */}
      {/* TABS */}
      {/* -------------------------------------------------- */}
      <TechnicalTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        technicalData={technicalData}
        loading={loadingIndicators}
        error={error}
        handleRemove={removeTechnicalIndicator}
      />
    </div>
  );
}
