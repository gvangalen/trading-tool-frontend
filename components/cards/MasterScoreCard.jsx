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

  // 🧠 Bepaal waarde
  const scoreValue = master?.score ? master.score.toFixed(1) : "–";

  return (
    <CardWrapper>
      <div className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm">

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
            <Brain className="w-4 h-4" />
          </div>

          <h2 className="text-sm font-semibold text-[var(--text-dark)]">
            AI Master Score
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            ⏳ Laden…
          </p>
        )}

        {/* Error */}
        {!loading && (error || !master) && (
          <p className="text-center text-red-500 dark:text-red-400 font-medium">
            ❌ Fout bij laden van AI Master Score
          </p>
        )}

        {/* Success view */}
        {!loading && master && (
          <>
            {/* Score */}
            <p
              className={`text-4xl font-bold tracking-tight ${getScoreColor(
                master.score
              )}`}
            >
              {scoreValue}
            </p>

            {/* Details */}
            <div className="mt-4 space-y-1.5 text-sm text-[var(--text-light)]">
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
          </>
        )}

      </div>
    </CardWrapper>
  );
}
