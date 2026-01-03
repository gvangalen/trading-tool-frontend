import ReportCard from "../ReportCard";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";

/* =====================================================
   HELPERS
===================================================== */

function isNum(v) {
  return v !== null && v !== undefined && v !== "" && !Number.isNaN(Number(v));
}

function formatNumber(v, decimals = 0) {
  if (!isNum(v)) return "–";
  return Number(v).toLocaleString(undefined, {
    maximumFractionDigits: decimals,
  });
}

function formatUSD(v) {
  if (!isNum(v)) return "–";
  return `$${formatNumber(v, 0)}`;
}

function formatPercent(v) {
  if (!isNum(v)) return "–";
  const n = Number(v);
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function scoreValue(v) {
  if (!isNum(v)) return "–";
  return Math.round(Number(v));
}

/* =====================================================
   SUB — SCORE ITEM
===================================================== */

function ScoreItem({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-2 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold text-gray-900">
        {scoreValue(value)}
      </div>
    </div>
  );
}

/* =====================================================
   BLOCK — MARKET SNAPSHOT (2.0)
===================================================== */

export default function MarketSnapshotBlock({
  report,
  title = "Market Snapshot",
}) {
  if (!report || typeof report !== "object") return null;

  const {
    price,
    change_24h,
    volume,
    macro_score,
    technical_score,
    market_score,
    setup_score,
  } = report;

  const hasAnyScores =
    isNum(macro_score) ||
    isNum(technical_score) ||
    isNum(market_score) ||
    isNum(setup_score);

  const changeIsUp = isNum(change_24h) ? Number(change_24h) >= 0 : null;

  return (
    <ReportCard title={title} icon={<TrendingUp size={18} />}>
      {/* === PRICE ROW === */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <DollarSign size={14} />
          <span>Bitcoin prijs</span>
        </div>

        <div className="mt-1 flex items-end gap-3">
          <div className="text-3xl font-semibold text-gray-900">
            {formatUSD(price)}
          </div>

          <div
            className={[
              "text-sm font-medium",
              changeIsUp === null
                ? "text-gray-500"
                : changeIsUp
                ? "text-green-600"
                : "text-red-600",
            ].join(" ")}
          >
            {formatPercent(change_24h)}
          </div>
        </div>
      </div>

      {/* === STATS ROW === */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BarChart3 size={14} />
          <span>
            Volume{" "}
            <strong className="text-gray-900">
              {formatNumber(volume, 0)}
            </strong>
          </span>
        </div>

        <div className="text-sm text-gray-500 sm:text-right">
          Laatste 24h verandering:{" "}
          <span className="font-medium text-gray-900">
            {formatPercent(change_24h)}
          </span>
        </div>
      </div>

      {/* === SCORES GRID === */}
      {hasAnyScores && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ScoreItem label="Macro" value={macro_score} />
          <ScoreItem label="Technical" value={technical_score} />
          <ScoreItem label="Market" value={market_score} />
          <ScoreItem label="Setup" value={setup_score} />
        </div>
      )}
    </ReportCard>
  );
}
