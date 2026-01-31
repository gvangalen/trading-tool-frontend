import React from "react";
import ReportCard from "../ReportCard";

export default function BotStrategyReportCard({ botStrategy, botSnapshot }) {
  if (!botStrategy && !botSnapshot) return null;

  return (
    <ReportCard
      title="🤖 Botbeslissing"
      subtitle={
        botSnapshot
          ? `${botSnapshot.bot_name} · confidence ${botSnapshot.confidence?.toUpperCase() || "—"}`
          : "Geen botactiviteit vandaag"
      }
    >
      <div className="space-y-3 text-sm leading-relaxed">
        {botSnapshot && (
          <div className="text-muted">
            De bot staat vandaag op <strong>{botSnapshot.action}</strong>.
          </div>
        )}

        {botStrategy && (
          <div>
            {botStrategy}
          </div>
        )}
      </div>
    </ReportCard>
  );
}
