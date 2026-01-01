import ReportCard from '../ReportCard';
import { Brain } from 'lucide-react';

/* =====================================================
   HELPERS – exact gedrag oud report
===================================================== */

function normalizeExecutiveSummary(value) {
  if (value === null || value === undefined) return null;

  // 1️⃣ string → direct tonen
  if (typeof value === 'string') {
    const v = value.trim();
    return v.length > 0 ? v : null;
  }

  // 2️⃣ object (jsonb / AI-output)
  if (typeof value === 'object') {
    // bekende patronen eerst
    if (typeof value.text === 'string') return value.text;
    if (typeof value.summary === 'string') return value.summary;
    if (typeof value.description === 'string') return value.description;

    // fallback: exact zoals oud report renderJson
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return null;
}

/* =====================================================
   BLOCK
===================================================== */

export default function SummaryBlock({
  report,
  title = 'Executive Summary',
}) {
  if (!report) return null;

  const content = normalizeExecutiveSummary(
    report.executive_summary
  );

  if (!content) return null;

  return (
    <ReportCard
      icon={<Brain size={18} />}
      title={title}
      content={content}
      full
      color="blue"
    />
  );
}
