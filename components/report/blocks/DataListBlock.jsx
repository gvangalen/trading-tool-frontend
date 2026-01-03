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
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : null;
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
   BLOCK — INDICATOR HIGHLIGHTS (GENERIC)
   - herbruikbaar voor Market / Macro / Technical
   - GEEN business logic
   - LEEST alleen report[field]
===================================================== */

export default function DataListBlock({
  report,
  title = 'Indicator Highlights',
  field,              // 👈 verplicht: bv 'indicator_highlights'
  maxItems = 6,
}) {
  if (!report || !field) return null;

  const indicators = parseJsonMaybe(report[field]);
  if (!Array.isArray(indicators) || indicators.length === 0) {
    return null;
  }

  return (
    <ReportCard
      title={title}
      icon={<ListChecks size={18} />}
    >
      <div className="grid gap-3">
        {indicators.slice(0, maxItems).map((item, idx) => {
          const name =
            item?.indicator ??
            item?.name ??
            'Onbekende indicator';

          const score =
            typeof item?.score === 'number'
              ? item.score
              : null;

          const interpretation =
            item?.interpretation ??
            item?.uitleg ??
            item?.advies ??
            item?.action ??
            null;

          return (
            <div
              key={idx}
              className="
                flex items-start gap-3
                rounded-lg
                border border-gray-100
                bg-white
                p-3
              "
            >
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                {getIconForIndicator(name)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">
                    {name}
                  </div>

                  {score !== null && (
                    <div className="text-sm font-semibold text-gray-900">
                      {score}
                    </div>
                  )}
                </div>

                {interpretation && (
                  <div className="mt-1 text-sm text-gray-600">
                    {interpretation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ReportCard>
  );
}
