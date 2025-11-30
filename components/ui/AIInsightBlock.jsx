'use client';

import { Bot } from "lucide-react";

export default function AIInsightBlock({ text, variant = "soft" }) {
  if (!text) return null;

  /* ---------------------------------------------
     🎨 VARIANT STYLES — clean & consistent
  --------------------------------------------- */
  const styles = {
    soft: `
      bg-[var(--surface-2)]
      border border-[var(--border)]
      text-[var(--text-light)]
    `,
    accent: `
      bg-[var(--surface-3)]
      border border-[var(--border)]
      text-[var(--text-dark)]
    `,
    trend: `
      bg-[var(--surface-3)]
      border border-[var(--border)]
      text-[var(--text-dark)]
    `
  };

  const active = styles[variant] || styles.soft;

  return (
    <div
      className={`
        w-full rounded-lg p-3 text-sm leading-relaxed
        flex items-start gap-2 shadow-sm
        ${active}
      `}
    >
      <Bot className="w-4 h-4 mt-[2px] opacity-60 text-[var(--primary)]" />
      <span>{text}</span>
    </div>
  );
}
