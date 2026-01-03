"use client";

import ReportSection from "../ReportSection";
import { Brain } from "lucide-react";

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
   BLOCK — Executive Summary (DOCUMENT)
   ✔ opening van het rapport
   ✔ geen card
   ✔ iets zwaardere typografie
===================================================== */

export default function SummaryBlock({
  report,
  title = "Dagoverzicht",
}) {
  if (!report || typeof report !== "object") return null;

  const content = normalizeExecutiveSummary(
    report.executive_summary
  );

  if (!content) return null;

  return (
    <ReportSection title={title}>
      <div className="text-[15px] leading-relaxed text-[var(--text-dark)]">
        {content}
      </div>
    </ReportSection>
  );
}
