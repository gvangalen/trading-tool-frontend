"use client";

import { useState } from "react";
import CardWrapper from "@/components/ui/CardWrapper";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useScoresData } from "@/hooks/useScoresData";

export default function MasterScoreCard() {
  const { master, loading, error } = useScoresData();
  const [expanded, setExpanded] = useState(false);

  /* ===========================================================
     🎨 Score kleur (consistente Fintech PRO stijl)
  =========================================================== */
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

            {/* SCORE (GROOT) */}
            <p
              className={`text-4xl font-bold tracking-tight ${getScoreColor(
                master.score
              )}`}
            >
              {scoreValue}
            </p>

            {/* BASIS FIELDS */}
            <div className="space-y-[3px] text-sm text-[var(--text-dark)]">
              <p><strong>Trend:</strong> {master.trend || "–"}</p>
              <p><strong>Bias:</strong> {master.bias || "–"}</p>
              <p><strong>Risico:</strong> {master.risk || "–"}</p>
            </div>

            {/* OUTLOOK PANEL */}
            {outlook && (
              <div className="mt-auto">
                <div
                  className={`
                    text-xs italic p-2 rounded-lg
                    bg-purple-100/50 dark:bg-purple-900/25
                    text-purple-700 dark:text-purple-200
                    border border-purple-200/40 dark:border-purple-800
                    transition-all duration-300
                    leading-relaxed
                    ${expanded ? "" : "line-clamp-2"}
                  `}
                >
                  <div className="flex items-start gap-1">
                    <Brain className="w-3 h-3 mt-[2px]" />
                    <span>{outlook}</span>
                  </div>
                </div>

                {/* EXPAND BUTTON */}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="
                    mt-1 text-xs text-[var(--primary-dark)]
                    hover:underline flex items-center gap-1
                  "
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
