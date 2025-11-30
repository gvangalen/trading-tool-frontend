'use client';

import { MessageSquare, ChevronRight } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchLatestReport } from "@/lib/api/report";
import AIInsightBlock from "@/components/ui/AIInsightBlock";

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

  const quote =
    report?.ai_summary_short ||
    report?.headline ||
    "Nieuw rapport beschikbaar!";

  return (
    <CardWrapper
      title="Daily Rapport"
      icon={<MessageSquare className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col gap-4 min-h-[220px]">

        {loading && <CardLoader text="Rapport laden…" />}

        {!loading && !report && (
          <p className="italic text-[var(--text-light)]">Nog geen rapport beschikbaar.</p>
        )}

        {!loading && report && (
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
              Bekijk laatste rapport <ChevronRight className="w-3 h-3" />
            </Link>
          </>
        )}
      </div>
    </CardWrapper>
  );
}
