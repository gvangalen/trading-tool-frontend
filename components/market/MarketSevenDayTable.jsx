"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { CalendarDays } from "lucide-react";
import { formatChange, formatNumber } from "@/components/market/utils";
import { useMemo } from "react";

export default function MarketSevenDayTable({ history }) {
  const MAX_ROWS = 7;

  const rows = useMemo(() => {
    const today = new Date();
    const result = [];

    for (let i = 0; i < MAX_ROWS; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const isoDate = date.toISOString().slice(0, 10);
      const formattedDate = date.toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "short",
      });

      const record = history?.find(
        (d) => new Date(d.date).toISOString().slice(0, 10) === isoDate
      );

      result.push({
        date: formattedDate,
        open: record?.open ?? null,
        high: record?.high ?? null,
        low: record?.low ?? null,
        close: record?.close ?? null,
        change: record?.change ?? null,
        volume: record?.volume ?? null,
      });
    }
    return result;
  }, [history]);

  /* ------------------------------
     Scorekleur volgens PRO 2.2
  ------------------------------ */
  const getChangeColor = (n) => {
    if (n === null || isNaN(n)) return "text-[var(--text-light)]";
    if (n > 0) return "text-green-600";
    if (n < 0) return "text-red-600";
    return "text-[var(--text-light)]";
  };

  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[var(--primary)]" />
          <span>Laatst 7 dagen (Prijs & Volume)</span>
        </div>
      }
    >
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-soft)] text-[var(--text-light)] text-xs uppercase">
            <tr className="border-b border-[var(--card-border)]">
              <th className="px-4 py-3 text-left font-semibold">Datum</th>
              <th className="px-4 py-3 text-right font-semibold">Open</th>
              <th className="px-4 py-3 text-right font-semibold">Hoog</th>
              <th className="px-4 py-3 text-right font-semibold">Laag</th>
              <th className="px-4 py-3 text-right font-semibold">Sluit</th>
              <th className="px-4 py-3 text-right font-semibold">% Dag</th>
              <th className="px-4 py-3 text-right font-semibold">Volume</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((day, idx) => (
              <tr
                key={idx}
                className="border-b border-[var(--card-border)] hover:bg-[var(--bg-soft)] transition-colors"
              >
                <td className="px-4 py-3 text-[var(--text-dark)] whitespace-nowrap">
                  {day.date}
                </td>

                <td className="px-4 py-3 text-right text-[var(--text-dark)]">
                  {typeof day.open === "number" ? formatNumber(day.open) : "…"}
                </td>

                <td className="px-4 py-3 text-right text-[var(--text-dark)]">
                  {typeof day.high === "number" ? formatNumber(day.high) : "…"}
                </td>

                <td className="px-4 py-3 text-right text-[var(--text-dark)]">
                  {typeof day.low === "number" ? formatNumber(day.low) : "…"}
                </td>

                <td className="px-4 py-3 text-right text-[var(--text-dark)]">
                  {typeof day.close === "number" ? formatNumber(day.close) : "…"}
                </td>

                <td
                  className={`px-4 py-3 text-right font-semibold ${getChangeColor(
                    day.change
                  )}`}
                >
                  {typeof day.change === "number"
                    ? formatChange(day.change)
                    : "…"}
                </td>

                <td className="px-4 py-3 text-right text-[var(--text-light)]">
                  {typeof day.volume === "number"
                    ? `$${(day.volume / 1e9).toFixed(1)}B`
                    : "…"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
