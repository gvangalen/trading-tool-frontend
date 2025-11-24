"use client";

import { useState } from "react";

import { useMacroData } from "@/hooks/useMacroData";
import { useScoresData } from "@/hooks/useScoresData";

import MacroTabs from "@/components/macro/MacroTabs";
import MacroIndicatorScoreView from "@/components/macro/MacroIndicatorScoreView";

import CardWrapper from "@/components/ui/CardWrapper";
import DayTable from "@/components/ui/DayTable";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

import { Globe, Brain, Activity } from "lucide-react";

export default function MacroPage() {
  const [activeTab, setActiveTab] = useState("Dag");

  // Nieuwe hookstructuur
  const {
    macroData,        // array van indicatoren (dag/week/maand/kwartaal)
    handleRemove,     // verwijdert indicator
    loading: loadingIndicators,
    error,
  } = useMacroData(activeTab);

  const { macro, loading: loadingScore } = useScoresData();

  // Scorekleur bepalen
  const getScoreColor = (score) => {
    const s = typeof score === "number" ? score : Number(score);
    if (isNaN(s)) return "text-gray-500";
    if (s >= 70) return "text-green-600";
    if (s <= 40) return "text-red-500";
    return "text-yellow-600";
  };

  const adviesText =
    (macro?.score ?? 0) >= 75
      ? "Positief"
      : (macro?.score ?? 0) <= 25
      ? "Negatief"
      : "Neutraal";

  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* ========================================================= */}
      {/* PAGE TITLE */}
      {/* ========================================================= */}
      <div className="flex items-center gap-3">
        <Globe size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)] tracking-tight">
          Macro Analyse
        </h1>
      </div>

      {/* ========================================================= */}
      {/* AI AGENT SAMENVATTING */}
      {/* ========================================================= */}
      <AgentInsightPanel category="macro" />

      {/* ========================================================= */}
      {/* MACRO SCORE SUMMARY */}
      {/* ========================================================= */}
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
              <span className={getScoreColor(macro?.score)}>
                {macro?.score ?? "–"}
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

      {/* ========================================================= */}
      {/* SCORE RULES (score ranges per indicator) */}
      {/* ========================================================= */}
      <MacroIndicatorScoreView />

      {/* ========================================================= */}
      {/* TABS (Dag / Week / Maand / Kwartaal) */}
      {/* ========================================================= */}
      <MacroTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        macroData={macroData}
        loading={loadingIndicators}
        error={error}
        handleRemove={handleRemove}
      />

      {/* ========================================================= */}
      {/* ACTUAL TABLE (universele DayTable) */}
      {/* ========================================================= */}
      <DayTable
        title={`Macro Analyse — ${activeTab}`}
        icon={<Globe className="w-5 h-5" />}
        data={macroData || []}
        onRemove={handleRemove}
      />

    </div>
  );
}
