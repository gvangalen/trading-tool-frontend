"use client";

import { useState } from "react";

import { useMacroData } from "@/hooks/useMacroData";
import { useScoresData } from "@/hooks/useScoresData";

import MacroTabs from "@/components/macro/MacroTabs";
import MacroIndicatorScoreView from "@/components/macro/MacroIndicatorScoreView";

import CardWrapper from "@/components/ui/CardWrapper";

import { Globe, Brain, Activity } from "lucide-react";

export default function MacroPage() {
  const [activeTab, setActiveTab] = useState("Dag");
  const [editIndicator, setEditIndicator] = useState(null);

  const {
    macroData,
    handleRemove,
    loading: loadingIndicators,
    error,
  } = useMacroData(activeTab);

  const { macro, loading: loadingScore } = useScoresData();

  /* THEME–NATIVE SCORE COLORS */
  const getScoreColor = (score) => {
    const s = Number(score);
    if (isNaN(s)) return "text-[var(--text-light)]";

    if (s >= 70) return "text-[var(--green)]";
    if (s <= 40) return "text-[var(--red)]";
    return "text-yellow-500"; // eventueel theme var
  };

  const adviesText =
    (macro?.score ?? 0) >= 75
      ? "Positief"
      : (macro?.score ?? 0) <= 25
      ? "Negatief"
      : "Neutraal";

  const adviesColor =
    adviesText === "Positief"
      ? "text-[var(--green)]"
      : adviesText === "Negatief"
      ? "text-[var(--red)]"
      : "text-yellow-500";

  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-10 animate-fade-slide bg-[var(--bg)] text-[var(--text-dark)]">

      {/* TITLE */}
      <div className="flex items-center gap-3">
        <Globe size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold tracking-tight">
          Macro Analyse
        </h1>
      </div>

      {/* SUMMARY */}
      <CardWrapper>
        <div className="space-y-4">

          <div className="flex items-center gap-3">
            <Brain className="text-[var(--primary)]" size={20} />
            <h2 className="text-lg font-semibold">
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
            <Activity className="text-[var(--primary)]" size={20} />
            <span className="font-semibold">
              Advies:{" "}
              {loadingScore ? (
                <span className="text-[var(--text-light)]">⏳</span>
              ) : (
                <span className={adviesColor}>{adviesText}</span>
              )}
            </span>
          </div>
        </div>
      </CardWrapper>

      {/* INDICATOR SCORE RULES */}
      <MacroIndicatorScoreView />

      {/* TABS */}
      <MacroTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        macroData={macroData}
        loading={loadingIndicators}
        error={error}
        handleRemove={handleRemove}
      />

      {/* EDIT POPUP */}
      {editIndicator && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">

            <h3 className="text-lg font-semibold text-[var(--text-dark)]">
              ✏️ Bewerk {editIndicator.name}
            </h3>

            <button
              onClick={() => setEditIndicator(null)}
              className="
                px-4 py-2 rounded-lg
                bg-[var(--bg-soft)]
                hover:bg-[var(--card-border)]/40
                text-[var(--text-dark)]
                transition
              "
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
