"use client";

import { useState } from "react";

import { TrendingUp, Brain, Activity } from "lucide-react";

import { useTechnicalData } from "@/hooks/useTechnicalData";
import { useScoresData } from "@/hooks/useScoresData";

import TechnicalTabs from "@/components/technical/TechnicalTabs";
import TechnicalIndicatorScoreView from "@/components/technical/TechnicalIndicatorScoreView";

import CardWrapper from "@/components/ui/CardWrapper";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

export default function TechnicalPage() {
  const [activeTab, setActiveTab] = useState("Dag");

  const {
    technicalData,
    handleRemove,
    loading: loadingIndicators,
    error,
  } = useTechnicalData(activeTab);

  const { technical, loading: loadingScore } = useScoresData();

  /* =====================================================
     SCORE → kleurklasse (zelfde logica als macro)
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

  const adviesText =
    (technical?.score ?? 0) >= 75
      ? "Positief"
      : (technical?.score ?? 0) <= 25
      ? "Negatief"
      : "Neutraal";

  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* ================================================
          PAGE TITLE
      ================================================= */}
      <div className="flex items-center gap-3">
        <TrendingUp size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)] tracking-tight">
          Technische Analyse
        </h1>
      </div>

      {/* ================================================
          AI SAMENVATTING
      ================================================= */}
      <AgentInsightPanel category="technical" />

      {/* ================================================
          TOTALE TECHNISCHE SCORE (zoals Macro)
      ================================================= */}
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
              <span className={getScoreColor(technical?.score)}>
                {technical?.score ?? "–"}
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

      {/* ================================================
          SCORE REGELS COMPONENT (Zoeken + Scoreregels)
      ================================================= */}
      <TechnicalIndicatorScoreView />

      {/* ================================================
          TABS + TABEL (DayTable)
      ================================================= */}
      <TechnicalTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        technicalData={technicalData}
        loading={loadingIndicators}
        error={error}
        handleRemove={handleRemove}
      />

    </div>
  );
}
