"use client";

import { useEffect, useState } from "react";
import { MessageSquareQuote, Brain } from "lucide-react";
import Link from "next/link";
import CardWrapper from "@/components/ui/CardWrapper";

export default function ReportCard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Laatste report ophalen
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/report/latest");
        const data = await res.json();
        if (data && !data.error) setReport(data);
      } catch (err) {
        console.error("❌ ReportCard error:", err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔥 Eén enkele korte zin (fallback is kort)
  const insight =
    report?.ai_insight_short ||
    report?.summary_short ||
    "Het nieuwste dagelijkse rapport is klaar.";

  return (
    <CardWrapper
      title="Daily AI Rapport"
      icon={<MessageSquareQuote className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col gap-4 min-h-[140px]">

        {/* LOADING */}
        {loading && (
          <p className="text-[var(--text-light)] italic text-sm py-1">
            ⏳ Laden…
          </p>
        )}

        {/* EMPTY */}
        {!loading && !report && (
          <p className="italic text-[var(--text-light)] text-sm py-1">
            Geen rapport gevonden.
          </p>
        )}

        {/* KORTE AI-QUOTE */}
        {!loading && report && (
          <div
            className="
              text-sm text-[var(--text-dark)]
              bg-purple-100/40 dark:bg-purple-900/20
              border border-purple-200/40 dark:border-purple-800/30
              rounded-lg p-2 leading-relaxed
            "
          >
            <div className="flex items-start gap-1">
              <Brain className="w-3 h-3 mt-[2px] text-purple-600 dark:text-purple-300" />
              <span className="line-clamp-1">{insight}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto">
          <Link
            href="/report"
            className="
              text-xs font-medium 
              text-[var(--primary-dark)]
              hover:text-[var(--primary)]
              hover:underline transition
            "
          >
            Bekijk volledige analyse →
          </Link>
        </div>
      </div>
    </CardWrapper>
  );
}
