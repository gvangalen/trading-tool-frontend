"use client";

import { useEffect } from "react";
import { Clock } from "lucide-react";

import useBotData from "@/hooks/useBotData";

/**
 * BotTradeTable
 * --------------------------------------------------
 * - Toont ECHTE uitgevoerde trades (ledger execute)
 * - Gebruikt centrale useBotData hook
 * - Geen directe API calls
 * - Backend = single source of truth
 * - Volgt GLOBAL THEME (globals.css)
 */
export default function BotTradeTable({ botId }) {
  const {
    tradesByBot,
    loadTradesForBot,
    loading,
  } = useBotData();

  const trades = tradesByBot?.[botId] || [];
  const isLoading = loading?.trades;

  /* =====================================================
     🔁 LOAD TRADES (lazy per bot)
  ===================================================== */
  useEffect(() => {
    if (!botId) return;
    loadTradesForBot(botId, 20);
  }, [botId, loadTradesForBot]);

  /* =====================================================
     STATES
  ===================================================== */
  if (isLoading) {
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
                <td className="px-3 py-2">
                  {t.executed_at
                    ? new Date(t.executed_at).toLocaleString()
                    : "—"}
                </td>

                {/* ACTIE — via GLOBAL SCORE KLEUREN */}
                <td className="px-3 py-2 font-medium score-buy">
                  {(t.side || "buy").toUpperCase()}
                </td>

                <td className="px-3 py-2">
                  {Number(t.qty || 0).toFixed(6)} {t.symbol || "BTC"}
                </td>

                <td className="px-3 py-2">
                  {t.price != null ? `€${t.price}` : "—"}
                </td>

                <td className="px-3 py-2">
                  {t.amount_eur != null ? `€${t.amount_eur}` : "—"}
                </td>

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
