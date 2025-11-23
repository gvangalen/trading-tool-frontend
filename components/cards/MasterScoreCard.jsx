'use client';

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

  const outlook = master?.outlook || "";
  const scoreValue = master?.score ? master.score.toFixed(1) : "–";

  return (
    <CardWrapper>
      <div
        className="
          h-[260px]
          p-5 rounded-xl
          border border-[var(--card-border)]
          bg-[var(--card-bg)]
          shadow-sm
          flex flex-col justify-between
        "
      >

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 shadow-sm">
            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-300" />
          </div>

          <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
            AI Master Score
          </h2>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-[var(--text-light)] italic py-6 flex-1">
            ⏳ Laden…
          </p>
        )}

        {/* ERROR */}
        {!loading && (error || !master) && (
          <p className="text-center text-red-500 dark:text-red-400 font-medium py-6">
            ❌ Fout bij laden van AI Master Score
          </p>
        )}

        {/* SUCCESS */}
        {!loading && master && (
          <div className="flex flex-col justify-between flex-1">

            {/* SCORE VALUE */}
            <p
              className={`text-4xl font-bold tracking-tight ${getScoreColor(
                master.score
              )}`}
            >
              {scoreValue}
            </p>

            {/* DETAILS */}
            <div className="space-y-[3px] text-sm text-[var(--text-dark)] mt-1">
              <p>
                <strong>Trend:</strong> {master.trend || "–"}
              </p>
              <p>
                <strong>Bias:</strong> {master.bias || "–"}
              </p>
              <p>
                <strong>Risico:</strong> {master.risk || "–"}
              </p>
            </div>

            {/* OUTLOOK COLLAPSIBLE */}
            {outlook && (
              <div className="mt-3">
                <div
                  className={`
                    text-xs italic p-2 rounded-lg
                    bg-purple-100/50 dark:bg-purple-900/30
                    text-purple-700 dark:text-purple-200
                    border border-purple-200/40 dark:border-purple-800
                    transition-all duration-300
                    ${expanded ? "h-auto" : "line-clamp-2"}
                  `}
                >
                  <div className="flex items-start gap-1">
                    <Brain className="w-3 h-3 mt-[2px]" />
                    <span>{outlook}</span>
                  </div>
                </div>

                <button
                  className="
                    mt-1 text-[var(--primary-dark)] text-xs
                    hover:underline flex items-center gap-1
                  "
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <>
                      Toon minder <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Toon meer <ChevronDown className="w-3 h-3" />
                    </>
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
