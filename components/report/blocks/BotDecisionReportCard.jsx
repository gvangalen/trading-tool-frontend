export default function BotDecisionReportCard({ snapshot }) {
  if (!snapshot) {
    return (
      <div className="text-sm text-muted italic">
        Geen botbeslissing voor deze dag
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-4 space-y-3">
      <div className="text-sm font-medium">
        🤖 {snapshot.bot_name || "Trading Bot"}
      </div>

      <div className="text-sm">
        Actie: <strong>{snapshot.action}</strong>
      </div>

      <div className="text-sm">
        Confidence: {snapshot.confidence}%
      </div>

      {snapshot.amount_eur && (
        <div className="text-sm">
          Bedrag: €{snapshot.amount_eur}
        </div>
      )}

      {snapshot.setup_match && (
        <div className="text-xs text-muted">
          Setup match: {snapshot.setup_match}
        </div>
      )}
    </div>
  );
}
