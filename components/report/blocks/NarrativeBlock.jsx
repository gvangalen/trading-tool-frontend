import ReportCard from '../ReportCard';
import { FileText } from 'lucide-react';

/* =====================================================
   HELPERS – block-eigen normalisatie
===================================================== */

function normalizeText(input) {
  if (!input) return null;

  // string → direct gebruiken
  if (typeof input === 'string') {
    const t = input.trim();
    return t.length > 0 ? t : null;
  }

  // object (jsonb uit DB / AI)
  if (typeof input === 'object') {
    // vaak AI-structuren: { summary, explanation, bullets, ... }
    if (Array.isArray(input)) {
      return input.map(String).join('\n');
    }

    // bekende keys eerst
    if (input.text) return normalizeText(input.text);
    if (input.summary) return normalizeText(input.summary);
    if (input.description) return normalizeText(input.description);

    // fallback: alles leesbaar maken
    return Object.values(input)
      .map((v) => {
        if (typeof v === 'string') return v;
        if (typeof v === 'number') return String(v);
        if (Array.isArray(v)) return v.join(', ');
        return null;
      })
      .filter(Boolean)
      .join('\n');
  }

  return null;
}

/* =====================================================
   BLOCK
===================================================== */

export default function NarrativeBlock({
  title,
  text,
  color = 'gray',
}) {
  const normalized = normalizeText(text);

  if (!normalized) return null;

  return (
    <ReportCard
      icon={<FileText size={18} />}
      title={title}
      pre
      color={color}
    >
      {normalized}
    </ReportCard>
  );
}
