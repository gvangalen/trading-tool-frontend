'use client';

import { useState } from "react";
import { Bot, ChevronDown, ChevronUp } from "lucide-react";

export default function AIInsightBlock({ text, variant = "soft" }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  /* ---------------------------------------------
     VARIANT STYLES
  --------------------------------------------- */
  const styles = {
    soft: {
      wrapper: `
        bg-[var(--surface-2)]
        border border-[var(--border)]
        text-[var(--text-light)]
      `,
      fade: `
        from-[var(--surface-2)]
      `,
    },

    accent: {
      wrapper: `
        bg-[var(--surface-3)]
        border border-[var(--border)]
        text-[var(--text-dark)]
      `,
      fade: `
        from-[var(--surface-3)]
      `,
    },
  };

  const active = styles[variant] || styles.soft;

  return (
    <div className="w-full flex flex-col gap-1">

      {/* WRAPPER */}
      <div
        className={`
          relative text-xs rounded-lg p-3 transition-all duration-300 shadow-sm
          ${active.wrapper}
        `}
      >
        {/* ICON + TEXT */}
        <div className="flex items-start gap-2">
          <Bot className="w-4 h-4 mt-[2px] opacity-60 text-[var(--primary)]" />
          <p
            className={`
              leading-snug transition-all duration-300
              ${expanded ? "" : "max-h-12 overflow-hidden"}
            `}
          >
            {text}
          </p>
        </div>

        {/* FADE MASK (only when clamped) */}
        {!expanded && (
          <div
            className={`
              absolute bottom-0 left-0 right-0 h-6
              bg-gradient-to-t pointer-events-none
              ${active.fade}
            `}
          />
        )}
      </div>

      {/* EXPAND BUTTON */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          text-[var(--primary-dark)]
          hover:underline
          text-xs font-medium
          flex items-center gap-1
          transition-all
        "
      >
        {expanded ? (
          <>
            Toon minder <ChevronUp className="w-3 h-3" />
          </>
        ) : (
          <>
            Toon meer <ChevronDown className="w-3 h-3" />
          </>
        )}
      </button>
    </div>
  );
}
