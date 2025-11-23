'use client';

import { MessageSquare } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import Link from "next/link";

export default function ReportCard() {
  return (
    <CardWrapper title="Daily Rapport">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3 mt-1">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 shadow-sm">
          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-300" />
        </div>

        <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
          Laatste Marktupdate
        </h2>
      </div>

      {/* QUOTE */}
      <p className="text-sm italic text-[var(--text-light)] leading-relaxed">
        “We blijven bullish zolang $101.500 standhoudt.”
      </p>

      {/* LINK */}
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

    </CardWrapper>
  );
}
