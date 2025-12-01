"use client";

import { MessageSquare, ChevronRight } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import Link from "next/link";

// Hook voor alle rapporten
import { useReportData } from "@/hooks/useReportData";

// Premium dashboard-variant block
import AIInsightBlock from "@/components/ui/AIInsightBlock";

export default function ReportCard() {
  const {
    report,
    loading,
    error,
  } = useReportData("daily");

  // 🛡️ Report moet een echt object zijn → geen array, geen string
  const safeReport =
    report && typeof report === "object" && !Array.isArray(report)
      ? report
      : null;

  // 🛡️ Quote MOET string zijn
  const quote =
    typeof safeReport?.ai_summary_short === "string"
      ? safeReport.ai_summary_short
      : typeof safeReport?.headline === "string"
      ? safeReport.headline
      : "Nieuw rapport is klaar!";

  return (
    <CardWrapper
      title="Daily Rapport"
      icon={<MessageSquare className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col gap-4 min-h-[220px]">

        {/* LOADING */}
        {loading && <CardLoader text="Rapport laden…" />}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-sm text-red-500 italic">{error}</p>
        )}

        {/* EMPTY */}
        {!loading && !error && !safeReport && (
          <p className="italic text-[var(--text-light)]">
            Nog geen rapport beschikbaar.
          </p>
        )}

        {/* CONTENT */}
        {!loading && safeReport && (
          <>
            <AIInsightBlock text={quote} variant="dashboard" />

            <Link
              href="/report"
              className="
                mt-auto text-xs font-medium
                text-[var(--primary-dark)]
                hover:underline flex items-center gap-1
              "
            >
              Bekijk laatste rapport
              <ChevronRight className="w-3 h-3" />
            </Link>
          </>
        )}
      </div>
    </CardWrapper>
  );
}
