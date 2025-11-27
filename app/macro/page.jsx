"use client";

import { useState } from "react";

import { useMacroData } from "@/hooks/useMacroData";
import { useScoresData } from "@/hooks/useScoresData";

import MacroTabs from "@/components/macro/MacroTabs";
import MacroIndicatorScoreView from "@/components/macro/MacroIndicatorScoreView";

import CardWrapper from "@/components/ui/CardWrapper";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

import { Globe, Brain, Activity } from "lucide-react";

export default function MacroPage() {
  const [activeTab, setActiveTab] = useState("Dag");

  // -------------------------------------------------------
  // 📡 Macrodata (Dag / Week / Maand / Kwartaal)
  // -------------------------------------------------------
  const {
    macroData,
    handleRemove,
    loading: loadingIndicators,
    error,
  } = useMacroData(activeTab);

  // -------------------------------------------------------
  // 📊 Totale Macro Score (uit score-API)
  // -------------------------------------------------------
  const { macro, loading: loadingScore } = useScoresData();

  // -------------------------------------------------------
  // 🎨 Score kleur op basis van nieuwe CSS-variabelen
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
  // 📌 Advies op basis van totale macro score
  // -------------------------------------------------------
  const adviesText =
    (macro?.score ?? 0) >= 75
      ? "Positief"
      : (macro?.score ?? 0) <= 25
      ? "Negatief"
      : "Neutraal";

  // -------------------------------------------------------
  // 🧱 RENDER
  // -------------------------------------------------------
  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* ---------------------------------------------------
          PAGE TITLE
      ----------------------------------------------------- */}
      <div className="flex items-center gap-3">
        <Globe size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)] tracking-tight">
          Macro Analyse
        </h1>
      </div>

      {/* ---------------------------------------------------
          AI SAMENVATTING
      ----------------------------------------------------- */}
      <AgentInsightPanel category="macro" />

      {/* ---------------------------------------------------
          MACRO SCORE SUMMARY
      ----------------------------------------------------- */}
      <CardWrapper>
        <div className="space-y-4">
          {/* Titel */}
          <div className="flex items-center gap-3">
            <Brain className="text-purple-600" size={20} />
            <h2 className="text-lg font-semibold text-[var(--text-dark)]">
              Totale Macro Score
            </h2>
          </div>

          {/* Score */}
          <div className="text-xl font-bold flex items-center gap-3">
            {loadingScore ? (
              <span className="text-[var(--text-light)]">⏳</span>
            ) : (
              <span className={getScoreColor(macro?.score)}>
                {macro?.score ?? "–"}
              </span>
            )}
          </div>

          {/* Advies */}
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

      {/* ---------------------------------------------------
          SCORE RULES VIEWER
      ----------------------------------------------------- */}
      <MacroIndicatorScoreView />

      {/* ---------------------------------------------------
          TABS + TABEL
      ----------------------------------------------------- */}
      <MacroTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        macroData={macroData}
        loading={loadingIndicators}
        error={error}
        handleRemove={handleRemove}   // 🔥 verwijderknop werkt nu altijd
      />
    </div>
  );
}
