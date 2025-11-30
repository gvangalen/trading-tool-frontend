"use client";

import { useEffect, useState } from "react";
import { MessageSquareQuote, Sparkles } from "lucide-react";
import Link from "next/link";
import CardWrapper from "@/components/ui/CardWrapper";

export default function ReportCard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Laatste report ophalen
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/report/latest");
        const data = await res.json();
        if (data && !data.error) setReport(data);
      } catch (err) {
        console.error("❌ ReportCard error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🧠 Korte teaser (fallback = superkort)
  const teaser =
    report?.ai_insight_short ||
    report?.summary_short ||
    "Nieuw rapport is klaar.";

  return (
    <CardWrapper
      title="Daily Rapport"
      icon={<MessageSquareQuote className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col min-h-[140px] justify-between">

        {/* LOADING */}
        {loading && (
          <p className="text-[var(--text-light)] italic text-sm py-1">
            ⏳ Rapport laden…
          </p>
        )}

        {/* EMPTY */}
        {!loading && !report && (
          <p className="italic text-[var(--text-light)] text-sm py-1">
            Geen rapport gevonden.
          </p>
        )}

        {/* AI TEASER */}
        {!loading && report && (
          <div
            className="
              flex items-start gap-2
              text-sm text-[var(--text-dark)]
              bg-blue-100/40 dark:bg-blue-900/20
              border border-blue-200/40 dark:border-blue-800/30
              rounded-lg p-2 leading-snug
            "
          >
            <Sparkles className="w-3 h-3 mt-[2px] text-blue-600 dark:text-blue-300" />
            <span className="line-clamp-1">{teaser}</span>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/report"
          className="
            text-xs font-medium mt-2
            text-[var(--primary-dark)]
            hover:text-[var(--primary)]
            hover:underline transition
          "
        >
          Open nieuwste rapport →
        </Link>
      </div>
    </CardWrapper>
  );
}
