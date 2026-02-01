import ReportCard from "../ReportCard";

/*
=====================================================
 BOT DECISION – REPORT CARD
 - Read-only snapshot
 - Exacte stijl als andere report cards
 - Geen bot-page logica
=====================================================
*/

export default function BotDecisionReportCard({ snapshot }) {
  if (!snapshot) return null;

  const {
    bot_name,
    action,
    confidence,
    amount_eur,
    setup_match,
  } = snapshot;

  return (
    <ReportCard title="Botbeslissing">
      <div className="space-y-2 text-sm">

        <Row label="Bot">
          {bot_name || "–"}
        </Row>

        <Row label="Actie">
          {action || "–"}
        </Row>

        <Row label="Confidence">
          {confidence != null ? `${confidence}%` : "–"}
        </Row>

        <Row label="Bedrag">
          {amount_eur != null ? `€${amount_eur}` : "–"}
        </Row>

        {setup_match && (
          <Row label="Setup match">
            {setup_match}
          </Row>
        )}

      </div>
    </ReportCard>
  );
}

/* ---------------------------------------------
   Helper
--------------------------------------------- */

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="font-medium text-right">
        {children}
      </span>
    </div>
  );
}
