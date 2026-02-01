import CardWrapper from "@/components/ui/CardWrapper";
import { Bot, ArrowUpRight, ArrowDownRight } from "lucide-react";

/* =======================================================
   Bot Decision — REPORT
======================================================= */
export default function BotDecisionReportCard({ report }) {
  const snapshot = report?.bot_snapshot;

  if (!snapshot) {
    return (
      <CardWrapper>
        <p className="text-sm text-[var(--text-light)]">
          Geen botbeslissing voor deze rapportdag.
        </p>
      </CardWrapper>
    );
  }

  const {
    bot_name,
    action,
    confidence,
    amount_eur,
    setup_match,
  } = snapshot;

  const isBuy = action?.toLowerCase() === "buy";

  return (
    <CardWrapper>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-[var(--primary)]" />
        <h2 className="text-lg font-semibold text-[var(--text-dark)]">
          Botbeslissing Vandaag
        </h2>
      </div>

      {/* Bot naam */}
      <p className="text-sm text-[var(--text-light)] mb-4">
        {bot_name || "Onbekende bot"}
      </p>

      {/* Actie */}
      <div className="flex items-center gap-2 mb-2">
        {isBuy ? (
          <ArrowUpRight className="w-4 h-4 text-green-600" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-600" />
        )}
        <span className="text-sm text-[var(--text-dark)]">
          <strong>Actie:</strong> {action || "—"}
        </span>
      </div>

      {/* Bedrag */}
      {amount_eur !== null && amount_eur !== undefined && (
        <p className="text-sm text-[var(--text-dark)] mb-2">
          <strong>Bedrag:</strong> €{amount_eur}
        </p>
      )}

      {/* Setup match */}
      {setup_match && (
        <p className="text-sm text-[var(--text-dark)] mb-2">
          <strong>Setup match:</strong> {setup_match}
        </p>
      )}

      {/* Confidence */}
      {confidence !== null && confidence !== undefined && (
        <p className="text-xs text-[var(--text-light)]">
          Confidence score:{" "}
          <strong className="text-[var(--text-dark)]">
            {confidence}%
          </strong>
        </p>
      )}
    </CardWrapper>
  );
}
