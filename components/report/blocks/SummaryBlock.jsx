"use client";

import ReportSection from "../ReportSection";

/* =====================================================
   HELPERS
   - robuust voor string / jsonb / AI-output
===================================================== */

function normalizeExecutiveSummary(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === "string") {
    const v = value.trim();
    return v.length ? v : null;
  }

  if (typeof value === "object") {
    if (typeof value.text === "string") return value.text.trim();
    if (typeof value.summary === "string") return value.summary.trim();
    if (typeof value.description === "string")
      return value.description.trim();

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return null;
}

/* =====================================================
   BLOCK — Executive Summary
   ✔ opening van het rapport
   ✔ meta (datum + gebruiker) HIER
   ✔ tekst eronder
===================================================== */

export default function SummaryBlock({
  report,
  title = "Dagoverzicht",
}) {
  if (!report || typeof report !== "object") return null;

  const content = normalizeExecutiveSummary(report.executive_summary);
  if (!content) return null;

  return (
    <ReportSection title={title}>
      <div className="space-y-3">

        {/* META — HIER IS DE ENIGE PLEK */}
        <div className="text-xs text-[var(--text-muted)]">
          {report.report_date && (
            <div>Datum: {report.report_date}</div>
          )}
          {report.user_name && (
            <div>Rapport voor: {report.user_name}</div>
          )}
        </div>

        {/* TEKST */}
        <div className="text-[15px] leading-relaxed text-[var(--text-dark)]">
          {content}
        </div>

      </div>
    </ReportSection>
  );
}
