import ReportCard from '../ReportCard';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
} from 'lucide-react';

/* =====================================================
   HELPERS
===================================================== */

function formatNumber(v, decimals = 2) {
  if (v === null || v === undefined || isNaN(v)) return '–';
  return Number(v).toLocaleString(undefined, {
    maximumFractionDigits: decimals,
  });
}

function formatPercent(v) {
  if (v === null || v === undefined || isNaN(v)) return '–';
  const n = Number(v);
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
}

/* =====================================================
   BLOCK — MARKET SNAPSHOT (2.0)
===================================================== */

export default function MarketSnapshotBlock({
  report,
  title = 'Market Snapshot',
}) {
  if (!report) return null;

  const {
    price,
    change_24h,
    volume,
    macro_score,
    technical_score,
    market_score,
    setup_score,
  } = report;

  return (
    <ReportCard
      title={title}
      icon={<TrendingUp size={18} />}
    >
      {/* === PRICE ROW === */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <DollarSign size={14} />
          Bitcoin prijs
        </div>

        <div className="flex items-end gap-3 mt-1">
          <div className="text-3xl font-semibold text-gray-900">
            ${formatNumber(price, 0)}
          </div>

          <div
            className={`text-sm font-medium ${
              Number(change_24h) >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {formatPercent(change_24h)}
          </div>
        </div>
      </div>

      {/* === STATS ROW === */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BarChart3 size={14} />
          <span>
            Volume&nbsp;
            <strong className="text-gray-900">
              {formatNumber(volume, 0)}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Activity size={14} />
          24h beweging
        </div>
      </div>

      {/* === SCORES GRID === */}
      <div className="grid grid-cols-4 gap-3">
        <ScoreItem label="Macro" value={macro_score} />
        <ScoreItem label="Technical" value={technical_score} />
        <ScoreItem label="Market" value={market_score} />
        <ScoreItem label="Setup" value={setup_score} />
      </div>
    </ReportCard>
  );
}

/* =====================================================
   SUB — SCORE ITEM
===================================================== */

function ScoreItem({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-100 p-2 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold text-gray-900">
        {value ?? '–'}
      </div>
    </div>
  );
}
