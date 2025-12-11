"use client";

import { MessageSquare, ChevronRight } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import Link from "next/link";

// Hook voor rapporten
import { useReportData } from "@/hooks/useReportData";

// Premium AI-blok
import AIInsightBlock from "@/components/ui/AIInsightBlock";

export default function ReportCard() {
  const { report, loading, error } = useReportData("daily");

  // ---------------------------------------------
  // 🎯 SAFE REPORT
  // ---------------------------------------------
  const safeReport =
    report && typeof report === "object" && !Array.isArray(report)
      ? report
      : null;

  // ---------------------------------------------
  // 🎯 404 DETECTIE (hook geeft geen echte code terug)
  // ---------------------------------------------
  const isNotFound =
    error === 404 ||
    error === "Not Found" ||
    error?.detail === "Not Found";

  // ---------------------------------------------
  // 🎯 AI SUMMARY STRING
  // ---------------------------------------------
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
      <div className="flex flex-col gap-4 min-height-[220px]">

        {/* -------------------------------------- */}
        {/* 🟡 LOADING STATE */}
        {/* -------------------------------------- */}
        {loading && <CardLoader text="Rapport laden…" />}

        {/* -------------------------------------- */}
        {/* 🔴 ECHTE ERROR (maar GEEN 404) */}
        {/* -------------------------------------- */}
        {!loading && error && !isNotFound && (
          <p className="text-sm text-red-500 italic">
            Rapport kon niet geladen worden.
          </p>
        )}

        {/* -------------------------------------- */}
        {/* 🟦 NIEUWE GEBRUIKER — NOG GEEN RAPPORT */}
        {/* -------------------------------------- */}
        {!loading && !safeReport && isNotFound && (
          <div className="text-sm text-[var(--text-light)] italic leading-relaxed">
            ✨ Je eerste dagelijkse rapport wordt
            <span className="font-semibold"> morgen vroeg</span> automatisch
            gegenereerd door de AI.

            <div className="mt-3">
              <Link
                href="/report/example"
                className="text-[var(--primary-dark)] hover:underline font-medium"
              >
                Bekijk voorbeeldrapport →
              </Link>
            </div>
          </div>
        )}

        {/* -------------------------------------- */}
        {/* 🟢 ER IS WEL EEN RAPPORT */}
        {/* -------------------------------------- */}
        {!loading && safeReport && (
          <>
            <AIInsightBlock text={quote} variant="dashboard" />

            <Link
              href={`/report?date=${safeReport.report_date}`}
              className="
                mt-auto text-xs font-medium
                text-[var(--primary-dark)]
                hover:underline
                flex items-center gap-1
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
