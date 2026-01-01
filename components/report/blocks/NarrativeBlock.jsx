import ReportCard from '../ReportCard';
import { FileText } from 'lucide-react';

/* =====================================================
   HELPERS – jsonb/string normalisatie + report-field resolver
   - Block krijgt RUWE DB-data (string of jsonb/object)
   - Section geeft óf `text` mee óf `field` + `report`
===================================================== */

function normalizeText(input) {
  if (input === null || input === undefined) return null;

  // string → direct gebruiken
  if (typeof input === 'string') {
    const t = input.trim();
    return t.length > 0 ? t : null;
  }

  // number/bool → string
  if (typeof input === 'number' || typeof input === 'boolean') {
    return String(input);
  }

  // array → regels
  if (Array.isArray(input)) {
    const lines = input
      .map((v) => {
        if (v === null || v === undefined) return null;
        if (typeof v === 'string') return v.trim();
        if (typeof v === 'number' || typeof v === 'boolean') return String(v);
        if (typeof v === 'object') {
          // probeer “mooie” keys
          const a = v.text ?? v.summary ?? v.description ?? v.title ?? v.name ?? null;
          if (a) return String(a).trim();
          try {
            return JSON.stringify(v, null, 2);
          } catch {
            return String(v);
          }
        }
        return String(v);
      })
      .filter(Boolean);

    return lines.length ? lines.join('\n') : null;
  }

  // object (jsonb uit DB / AI)
  if (typeof input === 'object') {
    // bekende keys eerst
    if (input.text) return normalizeText(input.text);
    if (input.summary) return normalizeText(input.summary);
    if (input.description) return normalizeText(input.description);
    if (input.content) return normalizeText(input.content);

    // soms: { bullets: [...] } of { points: [...] }
    if (input.bullets) return normalizeText(input.bullets);
    if (input.points) return normalizeText(input.points);
    if (input.items) return normalizeText(input.items);

    // fallback: stringify leesbaar
    try {
      const s = JSON.stringify(input, null, 2);
      return s && s.trim().length ? s : null;
    } catch {
      return null;
    }
  }

  return null;
}

// ✅ hiermee voorkom je “gokken”
// De block kan óf direct text krijgen, óf field+report (exact mapping op oude report velden)
function resolveText({ text, field, report }) {
  // 1) expliciet text wint
  const direct = normalizeText(text);
  if (direct) return direct;

  // 2) field uit report (oude naming 1-op-1)
  if (field && report && typeof report === 'object') {
    return normalizeText(report[field]);
  }

  return null;
}

/* =====================================================
   BLOCK
===================================================== */

export default function NarrativeBlock({
  title,
  // ✅ je kan ofwel `text` meegeven (raw)
  text,
  // ✅ ofwel `field` + `report` (aanrader: voorkomt naming fouten)
  field,
  report,
  color = 'gray',
  icon, // optioneel override icon
}) {
  const normalized = resolveText({ text, field, report });

  if (!normalized) return null;

  return (
    <ReportCard
      icon={icon || <FileText size={18} />}
      title={title}
      pre
      color={color}
    >
      {normalized}
    </ReportCard>
  );
}
