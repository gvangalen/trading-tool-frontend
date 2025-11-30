"use client";

import { MessageSquare, ChevronRight } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchLatestReport } from "@/lib/api/report";

export default function ReportCard() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLatestReport();
        setReport(data || null);
      } catch (err) {
        console.error("❌ ReportCard error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Dynamische korte quote — fallback
  const quote =
    report?.ai_summary_short ||
    report?.headline ||
    "Nieuw rapport beschikbaar!";

  return (
    <CardWrapper
      title="Daily Rapport"
      icon={<MessageSquare className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col gap-4 min-h-[200px]">

        {/* LOADING STATE */}
        {loading && <CardLoader text="Rapport laden…" />}

        {/* EMPTY STATE */}
        {!loading && !report && (
          <p className="text-sm italic text-[var(--text-light)] py-2">
            Nog geen rapport beschikbaar.
          </p>
        )}

        {/* CONTENT */}
        {!loading && report && (
          <>
            {/* QUOTE / HIGHLIGHT */}
            <div
              className="
                text-sm italic 
                text-[var(--text-light)]
                bg-blue-100/40 dark:bg-blue-900/20
                border border-blue-200/40 dark:border-blue-800/40
                p-3 rounded-lg
                leading-relaxed
                flex gap-2 items-start
              "
            >
              <MessageSquare className="w-4 h-4 mt-[2px] text-[var(--primary)]" />
              <span>{quote}</span>
            </div>

            {/* CTA */}
            <Link
              href="/report"
              className="
                mt-auto text-xs font-medium
                text-[var(--primary-dark)]
                hover:text-[var(--primary)]
                hover:underline
                transition flex items-center gap-1
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
