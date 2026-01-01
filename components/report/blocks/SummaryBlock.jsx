import ReportCard from '../ReportCard';
import { Brain } from 'lucide-react';

/* =====================================================
   HELPERS – summary normalisatie
===================================================== */

function normalizeSummary(input) {
  if (!input) return null;

  // 1️⃣ string → direct gebruiken
  if (typeof input === 'string') {
    return input;
  }

  // 2️⃣ object (jsonb uit DB / AI)
  if (typeof input === 'object') {
    // veel AI-agents geven { text, summary, description }
    if (input.text) return String(input.text);
    if (input.summary) return String(input.summary);
    if (input.description) return String(input.description);

    // fallback: leesbaar maken
    try {
      return JSON.stringify(input, null, 2);
    } catch {
      return String(input);
    }
  }

  return null;
}

/* =====================================================
   BLOCK
===================================================== */

export default function SummaryBlock({
  title = 'Samenvatting',
  summary,
  report,
}) {
  // ✅ voorkeur: hele report
  const resolvedSummary = normalizeSummary(
    report?.executive_summary ?? summary
  );

  if (!resolvedSummary) return null;

  return (
    <ReportCard
      icon={<Brain size={18} />}
      title={title}
      content={resolvedSummary}
      full
      color="blue"
    />
  );
}
