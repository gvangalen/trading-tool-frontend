import Card from "@/components/ui/Card";

/*
=====================================================
 BOT DECISION – REPORT CARD
 - Read-only snapshot
 - Exacte stijl als andere report cards
 - Geen live bot logica
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
    <Card>
      <div className="space-y-4">

        {/* Header */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            Botbeslissing
          </h4>
          <p className="text-xs text-gray-500">
            Feitelijke bot output (snapshot)
          </p>
        </div>

        {/* Content */}
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
      </div>
    </Card>
  );
}

/* ---------------------------------------------
   Helper
--------------------------------------------- */

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">
        {children}
      </span>
    </div>
  );
}
