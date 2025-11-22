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
          bg-[var(--card-bg)]
          border border-[var(--card-border)]
          shadow-sm
          transition hover:shadow-md hover:-translate-y-[1px]
        "
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-[var(--bg-soft)] shadow-sm text-[var(--text-dark)]">
            <MessageSquare className="w-4 h-4" />
          </div>

          <h2 className="text-sm font-semibold text-[var(--text-dark)]">
            Daily Rapport
          </h2>
        </div>

        {/* Quote */}
        <p className="text-sm italic text-[var(--text-light)] leading-relaxed">
          “We blijven bullish zolang $101.500 standhoudt.”
        </p>

        {/* Link */}
        <Link
          href="/report"
          className="
            mt-3 inline-block text-xs 
            text-[var(--primary-dark)] 
            hover:underline hover:text-[var(--primary)]
          "
        >
          Bekijk volledig rapport →
        </Link>
      </div>
    </CardWrapper>
  );
}
