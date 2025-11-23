"use client";

import { MessageSquare } from "lucide-react";
import CardWrapper from "@/components/ui/CardWrapper";
import Link from "next/link";

export default function ReportCard() {
  return (
    <CardWrapper
      title="Daily Rapport"
      icon={<MessageSquare className="w-4 h-4 text-[var(--primary)]" />}
    >
      <div className="flex flex-col gap-4 min-h-[200px]">

        {/* QUOTE */}
        <div
          className="
            text-sm italic 
            text-[var(--text-light)]
            bg-blue-100/40 dark:bg-blue-900/20
            border border-blue-200/40 dark:border-blue-800/40
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
