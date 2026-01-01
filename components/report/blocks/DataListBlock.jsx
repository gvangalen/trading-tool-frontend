import ReportCard from '../ReportCard';
import { ListChecks } from 'lucide-react';

/* =====================================================
   HELPERS – exact uit oud report gehaald
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

function formatIndicatorHighlights(report) {
  const raw = report?.indicator_highlights;
  const inds = parseJsonMaybe(raw);

  if (!inds || !Array.isArray(inds) || inds.length === 0) {
    return 'Geen indicator-highlights gevonden.';
  }

  return inds
    .slice(0, 8)
    .map((i) => {
      const name = i?.indicator ?? i?.name ?? '–';
      const score = i?.score ?? '–';
      const interp =
        i?.interpretation ?? i?.advies ?? i?.action ?? '–';
      return `- ${name}: score ${score} → ${interp}`;
    })
    .join('\n');
}

/* =====================================================
   BLOCK
===================================================== */

export default function DataListBlock({
  report,
  title = 'Indicator Highlights',
  color = 'gray',
}) {
  if (!report) return null;

  const content = formatIndicatorHighlights(report);
  if (!content) return null;

  return (
    <ReportCard
      icon={<ListChecks size={18} />}
      title={title}
      pre
      color={color}
    >
      {content}
    </ReportCard>
  );
}
