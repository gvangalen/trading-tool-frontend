'use client';

import { MessageSquare } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import Link from "next/link";

export default function ReportCard() {
  return (
    <CardWrapper>
      <div
        className="
          h-[260px]
          p-5 rounded-xl
          border border-[var(--card-border)]
          bg-[var(--card-bg)]
          shadow-sm
          flex flex-col justify-between
        "
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 shadow-sm">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>

          <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
            Daily Rapport
          </h2>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col justify-between">
          {/* QUOTE */}
          <div
            className="
              text-sm italic 
              text-[var(--text-light)]
              bg-blue-50/60 dark:bg-blue-900/30
              border border-blue-200/40 dark:border-blue-800
              p-3 rounded-lg
              leading-relaxed
              line-clamp-3
            "
          >
            “We blijven bullish zolang $101.500 standhoudt.”
          </div>

          {/* CTA */}
          <Link
            href="/report"
            className="
              mt-3 inline-block text-xs font-medium
              text-[var(--primary-dark)]
              hover:text-[var(--primary)]
              hover:underline
              transition
            "
          >
            Bekijk volledig rapport →
          </Link>
        </div>
      </div>
    </CardWrapper>
  );
}
