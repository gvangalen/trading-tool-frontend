"use client";

import { MessageSquare, ChevronRight } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import Link from "next/link";

// Hook voor rapporten (daily / weekly / monthly)
import { useReportData } from "@/hooks/useReportData";

// Premium AI-insight block
import AIInsightBlock from "@/components/ui/AIInsightBlock";

export default function ReportCard() {
  const { report, loading, error } = useReportData("daily");

  // ---------------------------------------------
  // 1️⃣ Veilig report object
  // ---------------------------------------------
  const safeReport =
    report && typeof report === "object" && !Array.isArray(report)
      ? report
      : null;

  // ---------------------------------------------
  // 2️⃣ AI quote, met fallbacks
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
      <div className="flex flex-col gap-4 min-h-[220px]">
        {/* 🟡 LOADING */}
        {loading && <CardLoader text="Rapport laden…" />}

        {/* 🟦 GEEN RAPPORT (NIEUWE GEBRUIKER / 404 / wat dan ook) */}
        {!loading && !safeReport && (
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

            {/* Optioneel: debug voor jezelf, niet zichtbaar voor gebruiker */}
            {process.env.NODE_ENV === "development" && error && (
              <p className="mt-3 text-[10px] text-red-400">
                (Debug info: {String(error)})
              </p>
            )}
          </div>
        )}

        {/* 🟢 ER IS WÉL EEN RAPPORT */}
        {!loading && safeReport && (
          <>
            <AIInsightBlock text={quote} variant="dashboard" />

            <Link
              href={`/report?date=${safeReport.report_date}`}
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
