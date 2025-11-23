"use client";

import { useState } from "react";
import CardWrapper from "@/components/ui/CardWrapper";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useScoresData } from "@/hooks/useScoresData";

export default function MasterScoreCard() {
  const { master, loading, error } = useScoresData();
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600 dark:text-green-300";
    if (score <= 40) return "text-red-600 dark:text-red-300";
    return "text-yellow-500 dark:text-yellow-300";
  };

  const scoreValue = master?.score ? master.score.toFixed(1) : "–";
  const outlook = master?.outlook || "";

  return (
    <CardWrapper
      title="AI Master Score"
      icon={<Brain className="w-4 h-4 text-purple-600" />}
    >
      <div className="flex flex-col gap-4 min-h-[200px]">

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
          <div className="flex flex-col gap-3">

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

            {/* OUTLOOK */}
            {outlook && (
              <div className="mt-1">
                <div
                  className={`
                    text-xs italic p-2 rounded-lg
                    bg-purple-100/40 dark:bg-purple-900/20
                    text-purple-700 dark:text-purple-200
                    border border-purple-200/40 dark:border-purple-800
                    transition-all duration-300
                    ${expanded ? "" : "line-clamp-2"}
                  `}
                >
                  <div className="flex items-start gap-1">
                    <Brain className="w-3 h-3 mt-[2px]" />
                    <span>{outlook}</span>
                  </div>
                </div>

                <button
                  onClick={() => setExpanded(!expanded)}
                  className="
                    mt-1 text-[var(--primary-dark)] text-xs
                    hover:underline flex items-center gap-1
                  "
                >
                  {expanded ? (
                    <>Toon minder <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Toon meer <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </CardWrapper>
  );
}
