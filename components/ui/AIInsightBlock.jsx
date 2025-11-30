'use client';

import { Bot } from "lucide-react";

export default function AIInsightBlock({
  text,
  variant = "dashboard", // default nieuwe variant
}) {
  if (!text) return null;

  const styles = {
    dashboard: `
      bg-[var(--surface-2)]
      border border-[var(--border)]
      text-[var(--text-light)]
      rounded-lg p-3 text-xs leading-snug
      relative overflow-hidden shadow-sm
    `,
  };

  return (
    <div className="w-full">
      <div className={styles[variant] || styles.dashboard}>
        <div className="flex items-start gap-2">
          <Bot className="w-4 h-4 mt-[2px] text-[var(--primary)] opacity-70" />
          <p className="line-clamp-3 pr-2">{text}</p>
        </div>

        {/* Fade overlay for clamped text */}
        <div
          className="
            pointer-events-none
            absolute bottom-0 left-0 right-0 h-6
            bg-gradient-to-t from-[var(--surface-2)]
          "
        />
      </div>
    </div>
  );
}
