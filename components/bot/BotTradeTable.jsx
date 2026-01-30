"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function BotTradeTable({ botId }) {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!botId) return;

    async function fetchTrades() {
      try {
        setLoading(true);
        const res = await fetch(`/api/bot/trades?bot_id=${botId}&limit=20`);
        if (!res.ok) throw new Error("Failed to fetch trades");
        const data = await res.json();
        setTrades(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrades();
  }, [botId]);

  if (loading) {
    return (
      <div className="mt-4 text-sm text-[var(--text-muted)]">
        Trades laden…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 text-sm text-red-500">
        {error}
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

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold mb-2">
        Uitgevoerde trades
      </h4>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
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
                  {new Date(t.executed_at).toLocaleString()}
                </td>

                <td className="px-3 py-2 font-medium text-green-600">
                  {t.side.toUpperCase()}
                </td>

                <td className="px-3 py-2">
                  {t.qty.toFixed(6)} {t.symbol}
                </td>

                <td className="px-3 py-2">
                  {t.price ? `€${t.price}` : "—"}
                </td>

                <td className="px-3 py-2">
                  {t.amount_eur ? `€${t.amount_eur}` : "—"}
                </td>

                <td className="px-3 py-2 capitalize text-[var(--text-muted)]">
                  {t.mode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
