"use client";

import { Clock } from "lucide-react";

/**
 * BotTradeTable
 * --------------------------------------------------
 * - Pure presentational component
 * - Ontvangt trades via props
 * - GEEN hooks
 * - GEEN API
 * - Backend = single source of truth
 */

/* =====================================================
   HELPERS
===================================================== */
function tradeSideClass(side) {
  if (side === "buy") return "score-buy";
  if (side === "sell") return "score-sell";
  return "score-neutral";
}

export default function BotTradeTable({ trades = [], loading = false }) {
  /* =====================================================
     STATES
  ===================================================== */
  if (loading) {
    return (
      <div className="mt-4 text-sm text-[var(--text-muted)]">
        Trades laden…
      </div>
    );
  }

  if (!trades.length) {
    return (
      <div className="mt-4 text-sm text-[var(--text-muted)] flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Nog geen uitgevoerde trades
      </div>
    );
  }

  /* =====================================================
     TABLE
  ===================================================== */
  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold mb-2">
        Uitgevoerde trades
      </h4>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-2)] text-left">
            <tr>
              <th className="px-3 py-2">Datum</th>
              <th className="px-3 py-2">Actie</th>
              <th className="px-3 py-2">Aantal</th>
              <th className="px-3 py-2">Prijs</th>
              <th className="px-3 py-2">Bedrag</th>
              <th className="px-3 py-2">Mode</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((t) => (
              <tr key={t.id} className="border-t">
                {/* DATUM */}
                <td className="px-3 py-2">
                  {t.executed_at
                    ? new Date(t.executed_at).toLocaleString("nl-NL")
                    : "—"}
                </td>

                {/* ACTIE (BUY / SELL) */}
                <td
                  className={`px-3 py-2 font-medium ${tradeSideClass(
                    t.side
                  )}`}
                >
                  {(t.side || "—").toUpperCase()}
                </td>

                {/* AANTAL */}
                <td className="px-3 py-2">
                  {Number(t.qty || 0).toFixed(6)} {t.symbol || "BTC"}
                </td>

                {/* PRIJS */}
                <td className="px-3 py-2">
                  {t.price != null ? `€${t.price}` : "—"}
                </td>

                {/* BEDRAG */}
                <td className="px-3 py-2">
                  {t.amount_eur != null ? `€${t.amount_eur}` : "—"}
                </td>

                {/* MODE */}
                <td className="px-3 py-2 capitalize text-[var(--text-muted)]">
                  {t.mode || "manual"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
