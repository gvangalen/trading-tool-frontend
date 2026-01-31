"use client";

import React, { useEffect } from "react";
import ReportCard from "../ReportCard";

/**
 * BotStrategyReportCard
 * --------------------------------------------------
 * - Toont botbeslissing in report
 * - Werkt ook als er GEEN bot_snapshot is
 * - Extra logging om exact te zien wat binnenkomt
 * - GEEN business logic
 * - Backend blijft single source of truth
 */
export default function BotStrategyReportCard({ botStrategy, botSnapshot }) {
  /* =====================================================
     DEBUG LOGGING (client-side)
  ===================================================== */
  useEffect(() => {
    console.group("🤖 BotStrategyReportCard");
    console.log("botStrategy:", botStrategy);
    console.log("botSnapshot:", botSnapshot);
    console.log("hasStrategy:", Boolean(botStrategy));
    console.log("hasSnapshot:", Boolean(botSnapshot));
    console.groupEnd();
  }, [botStrategy, botSnapshot]);

  /* =====================================================
     RENDER
     ❗️Geen early return meer → altijd zichtbaar
  ===================================================== */

  return (
    <ReportCard
      title="🤖 Botbeslissing"
      subtitle={
        botSnapshot
          ? `${botSnapshot.bot_name || "Bot"} · confidence ${
              botSnapshot.confidence?.toUpperCase() || "—"
            }`
          : "Geen expliciete botactie vandaag"
      }
    >
      <div className="space-y-3 text-sm leading-relaxed">
        {/* BOT STATUS */}
        {botSnapshot ? (
          <div className="text-muted">
            De bot stond vandaag op{" "}
            <strong className="uppercase">
              {botSnapshot.action || "onbekend"}
            </strong>
            {typeof botSnapshot.amount_eur === "number" &&
              botSnapshot.amount_eur > 0 && (
                <> · bedrag €{botSnapshot.amount_eur.toFixed(0)}</>
              )}
          </div>
        ) : (
          <div className="italic text-[var(--text-muted)]">
            Er is vandaag geen botbeslissing opgeslagen in de database.
          </div>
        )}

        {/* BOT STRATEGY TEKST (AI) */}
        {botStrategy ? (
          <div>{botStrategy}</div>
        ) : (
          <div className="italic text-[var(--text-muted)]">
            Geen aanvullende botanalyse beschikbaar.
          </div>
        )}
      </div>
    </ReportCard>
  );
}
