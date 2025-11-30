"use client";

import { useState } from "react";
import CardWrapper from "@/components/ui/CardWrapper";
import { Brain } from "lucide-react";
import { useScoresData } from "@/hooks/useScoresData";

export default function MasterScoreCard() {
  const { master, loading, error } = useScoresData();

  /* ===========================================================
     🎨 Score kleur (Fintech PRO stijl)
  =========================================================== */
  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600 dark:text-green-300";
    if (score <= 40) return "text-red-600 dark:text-red-300";
    return "text-yellow-500 dark:text-yellow-300";
  };

  const scoreValue = master?.score ? master.score.toFixed(1) : "–";

  // 1 REGEL korte outlook (geen blok!)
  const outlookLine = master?.outlook
    ? master.outlook.split(".")[0] // pak eerste zin
    : "Geen outlook beschikbaar.";

  return (
    <CardWrapper
      title="AI Master Score"
      icon={<Brain className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col gap-4 min-h-[220px]">

        {/* LOADING */}
        {loading && (
          <p className="text-center text-[var(--text-light)] italic py-3">
            ⏳ Laden…
          </p>
        )}

        {/* ERROR */}
        {!loading && (error || !master) && (
          <p className="text-center text-red-500 dark:text-red-400 font-medium py-3">
            ❌ Fout bij laden van AI Master Score
          </p>
        )}

        {/* CONTENT */}
        {!loading && master && (
          <div className="flex flex-col gap-4 flex-1">

            {/* SCORE */}
            <p
              className={`text-4xl font-bold tracking-tight ${getScoreColor(
                master.score
              )}`}
            >
              {scoreValue}
            </p>

            {/* DETAILS */}
            <div className="space-y-[3px] text-sm text-[var(--text-dark)]">
              <p><strong>Trend:</strong> {master.trend || "–"}</p>
              <p><strong>Bias:</strong> {master.bias || "–"}</p>
              <p><strong>Risico:</strong> {master.risk || "–"}</p>
            </div>

            {/* 1-REGEL OUTLOOK PREVIEW (geen blok) */}
            <p className="text-xs text-[var(--text-light)] italic mt-auto line-clamp-1">
              {outlookLine}
            </p>
          </div>
        )}
      </div>
    </CardWrapper>
  );
}
