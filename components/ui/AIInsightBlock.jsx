'use client';

import { useState } from "react";
import { Bot, ChevronDown, ChevronUp } from "lucide-react";

export default function AIInsightBlock({ text }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  return (
    <div className="w-full flex flex-col gap-1">

      {/* WRAPPER */}
      <div
        className={`
          relative text-sm rounded-lg border
          p-3
          bg-purple-50/60 dark:bg-purple-950/30
          border-purple-200/40 dark:border-purple-800/40
          text-purple-800 dark:text-purple-200
          transition-all duration-300
          shadow-sm
        `}
      >
        {/* ICON + TEXT */}
        <div className="flex items-start gap-2">
          <Bot className="w-4 h-4 mt-[2px] opacity-70" />
          <p
            className={`
              leading-relaxed transition-all duration-300
              ${expanded ? "" : "max-h-12 overflow-hidden"}
            `}
          >
            {text}
          </p>
        </div>

        {/* FADE MASK WHEN CLAMPED */}
        {!expanded && (
          <div
            className="
              absolute bottom-0 left-0 right-0 h-6
              bg-gradient-to-t from-purple-50/60 dark:from-purple-950/30
              pointer-events-none
            "
          />
        )}
      </div>

      {/* EXPAND BUTTON */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          text-[var(--primary-dark)]
          dark:text-purple-300
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
