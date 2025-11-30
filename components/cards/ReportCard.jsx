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
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const text =
    report?.ai_summary_short ||
    report?.headline ||
    "Nieuw rapport beschikbaar.";

  return (
    <CardWrapper
      title="Daily Rapport"
      icon={<MessageSquare className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col min-h-[170px]">

        {loading && <CardLoader text="Rapport laden…" />}

        {!loading && !report && (
          <p className="text-sm italic text-[var(--text-light)]">
            Nog geen rapport beschikbaar.
          </p>
        )}

        {!loading && report && (
          <>
            <p className="text-sm text-[var(--text-light)] line-clamp-1">
              {text}
            </p>

            <Link
              href="/report"
              className="
                mt-auto text-xs font-medium
                text-[var(--primary-dark)]
                hover:text-[var(--primary)]
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
