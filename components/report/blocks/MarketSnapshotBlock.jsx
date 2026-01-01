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

  const lines = [];

  // 🔹 Marktdata (exact zoals oude report)
  lines.push(`Prijs: $${formatValue(report.price)}`);
  lines.push(`24h: ${formatValue(report.change_24h, '%')}`);
  lines.push(`Volume: ${formatValue(report.volume)}`);

  // 🔹 Scores (zat vroeger óók in snapshot)
  if (
    report.macro_score !== undefined ||
    report.technical_score !== undefined ||
    report.market_score !== undefined ||
    report.setup_score !== undefined
  ) {
    lines.push(''); // lege regel
    lines.push('Scores:');
    lines.push(`Macro: ${formatValue(report.macro_score)}`);
    lines.push(`Technical: ${formatValue(report.technical_score)}`);
    lines.push(`Market: ${formatValue(report.market_score)}`);
    lines.push(`Setup: ${formatValue(report.setup_score)}`);
  }

  return lines;
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

  if (!lines.length) return null;

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
