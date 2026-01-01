import ReportCard from '../ReportCard';
import { TrendingUp } from 'lucide-react';

/* =====================================================
   HELPERS – block-eigen formatter
===================================================== */

function formatValue(v, suffix = '') {
  if (v === null || v === undefined || v === '') return '–';
  return `${v}${suffix}`;
}

function buildSnapshotLines(report) {
  if (!report) return [];

  return [
    `Prijs: $${formatValue(report.price)}`,
    `24h: ${formatValue(report.change_24h, '%')}`,
    `Volume: ${formatValue(report.volume)}`,
  ];
}

/* =====================================================
   BLOCK
===================================================== */

export default function MarketSnapshotBlock({
  report,
  title = 'Market Snapshot',
  color = 'blue',
}) {
  if (!report) return null;

  const lines = buildSnapshotLines(report);

  if (!lines || lines.length === 0) return null;

  return (
    <ReportCard
      icon={<TrendingUp size={18} />}
      title={title}
      pre
      color={color}
    >
      {lines.join('\n')}
    </ReportCard>
  );
}
