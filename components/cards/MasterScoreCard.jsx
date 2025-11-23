'use client';

import CardWrapper from "@/components/ui/CardWrapper";
import { Brain } from "lucide-react";
import { useScoresData } from "@/hooks/useScoresData";

export default function MasterScoreCard() {
  const { master, loading, error } = useScoresData();

  // 🎨 Dynamische kleur op basis van score
  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600 dark:text-green-300";
    if (score <= 40) return "text-red-600 dark:text-red-300";
    return "text-yellow-500 dark:text-yellow-300";
  };

  const scoreValue = master?.score ? master.score.toFixed(1) : "–";

  return (
    <CardWrapper title="AI Master Score">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3 mt-1">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 shadow-sm">
          <Brain className="w-5 h-5 text-purple-600 dark:text-purple-300" />
        </div>

        <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
          Markt Overzicht
        </h2>
      </div>

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
        <div className="space-y-4">

          {/* SCORE VALUE */}
          <p
            className={`text-4xl font-bold tracking-tight ${getScoreColor(
              master.score
            )}`}
          >
            {scoreValue}
          </p>

          {/* DETAILS */}
          <div className="space-y-1.5 text-sm text-[var(--text-light)]">
            <p>
              <strong className="text-[var(--text-dark)]">Trend:</strong>{" "}
              {master.trend || "–"}
            </p>
            <p>
              <strong className="text-[var(--text-dark)]">Bias:</strong>{" "}
              {master.bias || "–"}
            </p>
            <p>
              <strong className="text-[var(--text-dark)]">Risico:</strong>{" "}
              {master.risk || "–"}
            </p>
            <p>
              <strong className="text-[var(--text-dark)]">Outlook:</strong>{" "}
              <span className="italic">{master.outlook || "–"}</span>
            </p>
          </div>

        </div>
      )}
    </CardWrapper>
  );
}
