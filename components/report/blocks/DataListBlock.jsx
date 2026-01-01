import ReportCard from '../ReportCard';
import { ListChecks } from 'lucide-react';

/* =====================================================
   HELPERS – lokaal, block-eigen
===================================================== */

function normalizeItems(items) {
  if (!items) return [];

  // Al correct: array van strings
  if (Array.isArray(items) && items.every((i) => typeof i === 'string')) {
    return items;
  }

  // Array van objects (bijv. indicator_highlights, setups, etc.)
  if (Array.isArray(items)) {
    return items
      .map((i) => {
        if (typeof i === 'string') return i;

        if (typeof i === 'object' && i !== null) {
          const name = i.indicator || i.name || i.label || 'Item';
          const score =
            i.score !== undefined && i.score !== null
              ? ` (score ${i.score})`
              : '';
          const interp =
            i.interpretation || i.advies || i.action || '';

          return `${name}${score}${interp ? ` → ${interp}` : ''}`;
        }

        return null;
      })
      .filter(Boolean);
  }

  // JSON string uit DB
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items);
      return normalizeItems(parsed);
    } catch {
      return [items];
    }
  }

  return [];
}

/* =====================================================
   BLOCK
===================================================== */

export default function DataListBlock({
  title,
  items,
  emptyText = 'Geen data beschikbaar.',
  icon = <ListChecks size={18} />,
  color = 'gray',
}) {
  const normalized = normalizeItems(items);

  if (!normalized || normalized.length === 0) {
    return (
      <ReportCard icon={icon} title={title} color={color}>
        {emptyText}
      </ReportCard>
    );
  }

  return (
    <ReportCard icon={icon} title={title} pre color={color}>
      {normalized.map((i) => `- ${i}`).join('\n')}
    </ReportCard>
  );
}
