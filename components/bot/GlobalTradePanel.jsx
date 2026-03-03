"use client";

import { useActiveBot } from "@/context/ActiveBotContext";
import TradePanel from "./TradePanel"; // je bestaande trade component

export default function GlobalTradePanel() {
  const { activeBot } = useActiveBot();

  if (!activeBot) {
    return (
      <div className="card-surface p-6 text-center text-sm text-[var(--text-muted)]">
        Selecteer een bot om te handelen
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Context header */}
      <div className="card-surface p-4">
        <div className="text-sm text-[var(--text-muted)]">
          Handelen voor
        </div>
        <div className="font-semibold text-[var(--text-dark)]">
          {activeBot.name}
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          {activeBot.symbol} · {activeBot.timeframe}
        </div>
      </div>

      {/* Re-use je bestaande TradePanel */}
      <TradePanel bot={activeBot} />
    </div>
  );
}
