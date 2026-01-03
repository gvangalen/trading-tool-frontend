"use client";

import ReportCard from "../ReportCard";
import { Brain } from "lucide-react";

/* =====================================================
   HELPERS
   - robuust voor string / jsonb / AI-output
===================================================== */

function normalizeExecutiveSummary(value) {
  if (value === null || value === undefined) return null;

  // string → direct
  if (typeof value === "string") {
    const v = value.trim();
    return v.length ? v : null;
  }

  // object (jsonb / AI)
  if (typeof value === "object") {
    if (typeof value.text === "string") return value.text.trim();
    if (typeof value.summary === "string") return value.summary.trim();
    if (typeof value.description === "string") return value.description.trim();

    // fallback: leesbaar stringify
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return null;
}

/* =====================================================
   BLOCK — Executive Summary (2.0)
   - opening van het rapport
   - iets meer gewicht
   - nog steeds rustig
===================================================== */

export default function SummaryBlock({
  report,
  title = "Executive Summary",
}) {
  if (!report || typeof report !== "object") return null;

  const content = normalizeExecutiveSummary(
    report.executive_summary
  );

  if (!content) return null;

  return (
    <ReportCard
      icon={<Brain size={18} />}
      title={title}
      full
    >
      {/* 👇 iets grotere typografie dan normaal */}
      <div className="text-[15px] leading-relaxed text-[var(--text-dark)] space-y-3">
        {content}
      </div>
    </ReportCard>
  );
}
