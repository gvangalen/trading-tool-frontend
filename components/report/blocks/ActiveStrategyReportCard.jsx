import CardWrapper from "@/components/ui/CardWrapper";
import {
  Target,
  Shield,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/* =======================================================
   Active Strategy — REPORT
======================================================= */
export default function ActiveStrategyReportCard({ report }) {
  const strategy = report?.active_strategy;
  const currentPrice = report?.market_snapshot?.price ?? null;

  if (!strategy) {
    return (
      <CardWrapper>
        <p className="text-sm text-[var(--text-light)]">
          Geen actieve strategie voor deze rapportdag.
        </p>
      </CardWrapper>
    );
  }

  const {
    setup_name,
    symbol,
    timeframe,
    entry,
    targets,
    stop_loss,
    adjustment_reason,
    confidence_score,
  } = strategy;

  const isDCA = entry === null || entry === undefined;
  const referencePrice = isDCA ? currentPrice : entry;

  const priceDiff =
    currentPrice && referencePrice
      ? ((currentPrice - referencePrice) / referencePrice) * 100
      : null;

  const isPositive = priceDiff !== null && priceDiff >= 0;

  return (
    <CardWrapper>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
        <h2 className="text-lg font-semibold text-[var(--text-dark)]">
          Actieve Strategie Vandaag
        </h2>
      </div>

      {/* Meta */}
      <p className="text-sm text-[var(--text-light)] mb-4">
        {setup_name} · {symbol} · {timeframe}
      </p>

      {/* Entry / Startprijs */}
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-blue-500" />
        <span className="text-sm text-[var(--text-dark)]">
          {isDCA ? (
            <>
              <strong>Startprijs (referentie):</strong>{" "}
              {referencePrice
                ? referencePrice.toLocaleString()
                : "—"}
            </>
          ) : (
            <>
              <strong>Entry:</strong>{" "}
              {entry?.toLocaleString() ?? "—"}
            </>
          )}
        </span>
      </div>

      {/* DCA uitleg */}
      {isDCA && (
        <p className="text-xs text-[var(--text-light)] mb-3">
          DCA-strategie actief. Er is geen vast instapmoment — deze prijs
          dient als referentie voor performance sinds activatie.
        </p>
      )}

      {/* Performance */}
      {currentPrice && referencePrice && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-600" />
          )}
          <span className="text-[var(--text-dark)]">
            <strong>Referentie t.o.v. markt:</strong>{" "}
            {priceDiff.toFixed(2)}%
          </span>
        </div>
      )}

      {/* Targets */}
      {targets && (
        <div className="mb-3">
          <p className="text-sm font-medium text-[var(--text-dark)] mb-1">
            Targets
          </p>
          <ul className="ml-4 space-y-1">
            {targets.split(",").map((t, i) => (
              <li key={i} className="text-sm text-[var(--text-dark)]">
                • {t.trim()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stop loss */}
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-red-500" />
        <span className="text-sm text-[var(--text-dark)]">
          <strong>Stop-loss:</strong>{" "}
          {stop_loss?.toLocaleString() ?? "—"}
        </span>
      </div>

      {/* Adjustment */}
      {adjustment_reason && (
        <p className="text-sm text-[var(--text-dark)] mb-2">
          <strong>Aanpassing:</strong> {adjustment_reason}
        </p>
      )}

      {/* Confidence */}
      {confidence_score !== null &&
        confidence_score !== undefined && (
          <p className="text-xs text-[var(--text-light)]">
            Confidence score:{" "}
            <strong className="text-[var(--text-dark)]">
              {confidence_score}%
            </strong>
          </p>
        )}
    </CardWrapper>
  );
}
