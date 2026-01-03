import ReportCard from '../ReportCard';
import {
  ListChecks,
  TrendingUp,
  BarChart3,
  Activity,
} from 'lucide-react';

/* =====================================================
   HELPERS
===================================================== */

function parseJsonMaybe(value) {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return null;
}

function getIconForIndicator(name = '') {
  const n = name.toLowerCase();
  if (n.includes('change') || n.includes('price'))
    return <TrendingUp size={16} className="text-green-600" />;
  if (n.includes('volume'))
    return <BarChart3 size={16} className="text-blue-600" />;
  return <Activity size={16} className="text-gray-500" />;
}

/* =====================================================
   BLOCK — INDICATOR HIGHLIGHTS (ROBUST)
   ✔ werkt met oude market data
   ✔ werkt met macro / technical
   ✔ toont ALTIJD card
===================================================== */

export default function DataListBlock({
  report,
  title = 'Indicator Highlights',
  field,                 // nieuw (optioneel)
  maxItems = 6,
}) {
  if (!report) return null;

  // 🔁 BACKWARD COMPATIBLE FALLBACK
  const raw =
    (field && report[field]) ||
    report.indicator_highlights ||
    null;

  const inds = parseJsonMaybe(raw);

  return (
    <ReportCard
      title={title}
      icon={<ListChecks size={18} />}
    >
      {!Array.isArray(inds) || inds.length === 0 ? (
        /* =========================
           EMPTY STATE
        ========================= */
        <div className="text-sm text-gray-500 italic">
          Nog geen indicator-data beschikbaar voor dit onderdeel.
        </div>
      ) : (
        /* =========================
           DATA
        ========================= */
        <div className="grid gap-3">
          {inds.slice(0, maxItems).map((i, idx) => {
            const name = i?.indicator ?? i?.name ?? 'Onbekend';
            const score = i?.score;
            const interp =
              i?.interpretation ??
              i?.uitleg ??
              i?.advies ??
              i?.action;

            return (
              <div
                key={idx}
                className="
                  flex items-start gap-3
                  border border-gray-100
                  rounded-lg
                  p-3
                "
              >
                <div className="mt-0.5">
                  {getIconForIndicator(name)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">
                      {name}
                    </div>

                    {typeof score === 'number' && (
                      <div className="text-sm font-semibold text-gray-900">
                        {score}
                      </div>
                    )}
                  </div>

                  {interp && (
                    <div className="mt-1 text-sm text-gray-600">
                      {interp}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ReportCard>
  );
}
