'use client';

import { Info, AlertCircle } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import SkeletonTable from "@/components/ui/SkeletonTable";

/* --------------------------------------------
   Scorekleur (globale PRO 2.2 kleuren)
-------------------------------------------- */
const getScoreClass = (score) => {
  const n = typeof score === "number" ? score : Number(score);
  if (isNaN(n)) return "text-[var(--text-light)]";

  if (n >= 80) return "score-strong-buy";     // groen donker
  if (n >= 60) return "score-buy";            // groen licht
  if (n >= 40) return "score-neutral";        // geel
  if (n >= 20) return "score-sell";           // rood licht
  return "score-strong-sell";                 // rood donker
};

/* ============================================
   📊 Dashboard Macro Summary Table (READ-ONLY)
   Zelfde layout als DayTable – PRO UI
============================================ */
export default function MacroSummaryTableForDashboard({
  data = [],
  loading = false,
  error = "",
}) {

  if (loading) return <SkeletonTable rows={5} columns={5} />;

  if (error) {
    return (
      <CardWrapper>
        <p className="text-red-500">{error}</p>
      </CardWrapper>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <CardWrapper>
        <div className="p-4 text-center text-[var(--text-light)] flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Geen macrodata beschikbaar.</span>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper title={
      <div className="flex items-center gap-2">
        <span className="text-[var(--primary)]">🌍</span>
        <span>Macro Samenvatting</span>
      </div>
    }>
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] text-xs uppercase">
            <tr className="border-b border-[var(--card-border)]">
              <th className="px-4 py-3 text-left font-semibold">Indicator</th>
              <th className="px-4 py-3 text-center font-semibold">Waarde</th>
              <th className="px-4 py-3 text-center font-semibold">Score</th>
              <th className="px-4 py-3 text-center font-semibold">Advies</th>
              <th className="px-4 py-3 text-left font-semibold">Uitleg</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => {
              const name = item.name || item.indicator || "–";
              const value = item.value ?? "–";
              const score = item.score ?? null;
              const advice = item.action ?? "–";
              const explanation = item.interpretation ?? "–";

              return (
                <tr
                  key={`${name}-${i}`}
                  className="border-b border-[var(--card-border)] hover:bg-[var(--bg-soft)] transition-colors"
                >
                  {/* Indicator */}
                  <td className="px-4 py-3 font-medium text-[var(--text-dark)] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-[var(--text-light)]" />
                      {name}
                    </div>
                  </td>

                  {/* Value */}
                  <td className="px-4 py-3 text-center text-[var(--text-dark)]">
                    {value}
                  </td>

                  {/* Score */}
                  <td className={`px-4 py-3 text-center font-semibold ${getScoreClass(score)}`}>
                    {score ?? "–"}
                  </td>

                  {/* Advice */}
                  <td className="px-4 py-3 text-center text-[var(--text-dark)]">
                    {advice}
                  </td>

                  {/* Explanation */}
                  <td className="px-4 py-3 text-[var(--text-light)] leading-relaxed">
                    {explanation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
