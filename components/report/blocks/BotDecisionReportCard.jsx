import CardWrapper from "@/components/ui/CardWrapper";
import { Bot, ArrowUpRight, ArrowDownRight } from "lucide-react";

/* =======================================================
   Bot Decision — REPORT (snapshot-only)
======================================================= */
export default function BotDecisionReportCard({ snapshot }) {
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
    reason, // 👈 belangrijk voor HOLD / no-trade uitleg
  } = snapshot;

  const normalizedAction = action?.toLowerCase() || "hold";
  const isBuy = normalizedAction === "buy";
  const isSell = normalizedAction === "sell";

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
          <ArrowDownRight className="w-4 h-4 text-orange-500" />
        )}
        <span className="text-sm text-[var(--text-dark)]">
          <strong>Actie:</strong>{" "}
          {normalizedAction.toUpperCase()}
        </span>
      </div>

      {/* Bedrag (alleen bij trade) */}
      {(isBuy || isSell) &&
        amount_eur !== null &&
        amount_eur !== undefined && (
          <p className="text-sm text-[var(--text-dark)] mb-2">
            <strong>Bedrag:</strong> €{amount_eur}
          </p>
        )}

      {/* Setup match */}
      {setup_match !== null &&
        setup_match !== undefined && (
          <p className="text-sm text-[var(--text-dark)] mb-2">
            <strong>Setup match:</strong> {setup_match}
          </p>
        )}

      {/* HOLD / NO TRADE uitleg */}
      {!isBuy && !isSell && reason && (
        <p className="text-sm text-[var(--text-light)] mt-3">
          <strong>Waarom geen trade:</strong> {reason}
        </p>
      )}

      {/* Confidence */}
      {confidence !== null &&
        confidence !== undefined && (
          <p className="text-xs text-[var(--text-light)] mt-3">
            Confidence score:{" "}
            <strong className="text-[var(--text-dark)]">
              {confidence}%
            </strong>
          </p>
        )}
    </CardWrapper>
  );
}
