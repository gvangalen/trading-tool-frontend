'use client';

import { MessageSquare } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import Link from "next/link";

export default function ReportCard() {
  return (
    <CardWrapper>
      <div
        className="
          p-5 rounded-xl
          border border-[var(--card-border)]
          bg-[var(--card-bg)]
          shadow-sm
          flex flex-col gap-4
          min-h-[200px]     /* dynamisch, geen vaste hoogte */
        "
      >
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 shadow-sm">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>

          <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
            Daily Rapport
          </h2>
        </div>

        {/* QUOTE */}
        <div
          className="
            text-sm italic 
            text-[var(--text-light)]
            bg-blue-50/60 dark:bg-blue-900/30
            border border-blue-200/40 dark:border-blue-800
            p-3 rounded-lg
            leading-relaxed
          "
        >
          “We blijven bullish zolang $101.500 standhoudt.”
        </div>

        {/* CTA */}
        <Link
          href="/report"
          className="
            mt-auto text-xs font-medium
            text-[var(--primary-dark)]
            hover:text-[var(--primary)]
            hover:underline
            transition
          "
        >
          Bekijk volledig rapport →
        </Link>
      </div>
    </CardWrapper>
  );
}
