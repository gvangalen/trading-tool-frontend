import CardWrapper from "@/components/ui/CardWrapper";
import {
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  PauseCircle,
} from "lucide-react";

/* =======================================================
   Bot Decision — REPORT (ALWAYS SAFE)
   - Kan snapshot als object of JSON-string binnenkrijgen
   - Toont card altijd (ook bij geen trade)
======================================================= */
export default function BotDecisionReportCard({ snapshot }) {
  // 1) Normaliseer snapshot (kan string/jsonb zijn)
  let safeSnapshot = snapshot ?? {};

  if (typeof safeSnapshot === "string") {
    try {
      safeSnapshot = JSON.parse(safeSnapshot);
    } catch (e) {
      safeSnapshot = {};
    }
  }

  // Als er ooit arrays terugkomen (defensief)
  if (Array.isArray(safeSnapshot)) {
    safeSnapshot = safeSnapshot[0] ?? {};
  }

  // 2) Defaults (card moet altijd renderen)
  const {
    bot_name = "Bot",
    action = "hold",
    confidence = null,
    amount_eur = null,
    setup_match = null,
    reason = "Geen trade: voorwaarden niet voldaan.",
  } = safeSnapshot || {};

  // 3) Normaliseer action veilig
  const normalizedAction =
    typeof action === "string" ? action.toLowerCase() : "hold";

  const isBuy = normalizedAction === "buy";
  const isSell = normalizedAction === "sell";
  const isHold = !isBuy && !isSell;

  // 4) Confidence netjes tonen (numeric => %, anders string)
  const confidenceLabel = (() => {
    if (confidence === null || confidence === undefined) return null;
    if (typeof confidence === "number") return `${confidence}%`;
    if (typeof confidence === "string") return confidence.toUpperCase();
    return String(confidence);
  })();

  // 5) Amount netjes
  const amountLabel =
    amount_eur === null || amount_eur === undefined
      ? null
      : `€${amount_eur}`;

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
        {bot_name}
      </p>

      {/* Actie */}
      <div className="flex items-center gap-2 mb-3">
        {isBuy && <ArrowUpRight className="w-4 h-4 text-green-600" />}
        {isSell && <ArrowDownRight className="w-4 h-4 text-red-600" />}
        {isHold && <PauseCircle className="w-4 h-4 text-orange-500" />}

        <span className="text-sm text-[var(--text-dark)]">
          <strong>Actie:</strong>{" "}
          {(normalizedAction || "hold").toUpperCase()}
        </span>
      </div>

      {/* Bedrag (alleen bij trade) */}
      {(isBuy || isSell) && amountLabel && (
        <p className="text-sm text-[var(--text-dark)] mb-2">
          <strong>Bedrag:</strong> {amountLabel}
        </p>
      )}

      {/* Setup match (toon ook bij 0 / lege string) */}
      {setup_match !== null && setup_match !== undefined && (
        <p className="text-sm text-[var(--text-dark)] mb-2">
          <strong>Setup match:</strong> {String(setup_match)}
        </p>
      )}

      {/* HOLD / NO TRADE uitleg */}
      {isHold && reason && (
        <p className="text-sm text-[var(--text-light)] mt-3">
          <strong>Waarom geen trade:</strong> {reason}
        </p>
      )}

      {/* Confidence */}
      {confidenceLabel && (
        <p className="text-xs text-[var(--text-light)] mt-4">
          Confidence:{" "}
          <strong className="text-[var(--text-dark)]">
            {confidenceLabel}
          </strong>
        </p>
      )}
    </CardWrapper>
  );
}
