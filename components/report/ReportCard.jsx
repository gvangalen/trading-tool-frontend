"use client";

import React from "react";

/* ---------------------------------------------------------
   Mini utility fn
--------------------------------------------------------- */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ---------------------------------------------------------
   Content formatter — ALLEEN voor data
--------------------------------------------------------- */
function formatContent(value) {
  if (value === null || value === undefined) return "–";

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string" ? `- ${item}` : `- ${JSON.stringify(item, null, 2)}`
      )
      .join("\n");
  }

  if (typeof value === "object") {
    if (value.text) return value.text;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

/* =====================================================
   REPORT CARD — GRID SAFE (breedte/flow gefixt)
===================================================== */

export default function ReportCard({
  title,
  icon = null,

  /** DATA-modus */
  content,
  pre = false,

  /** UI-modus */
  children,

  /** layout */
  full = false,

  /**
   * Standalone layout (bv. single card boven/onder report):
   * - constrain: max width + centreren
   * - default: grid bepaalt breedte (w-full)
   */
  constrain = false,

  /**
   * Optional: maak content scrollbaar als het te lang wordt
   * (handig bij 10+ indicators)
   */
  scroll = false,
  maxHeight = "320px",
}) {
  const isDataMode = content !== undefined;

  return (
    <section
      className={cn(
        // basis
        "bg-white border border-gray-200 rounded-xl shadow-sm p-5",
        // grid safety
        "w-full min-w-0 h-full",
        // optioneel: standalone center layout
        constrain && "max-w-3xl mx-auto",
        // als je hem expres breder wil (bv. narrative card in 2 kolommen)
        full && "md:col-span-2",
        // scroll behavior
        scroll && "flex flex-col"
      )}
    >
      {/* Header */}
      {(title || icon) && (
        <header className="mb-3 flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          {title && (
            <h2 className="text-base font-semibold tracking-tight text-[var(--text-dark)]">
              {title}
            </h2>
          )}
        </header>
      )}

      {/* Content */}
      <div
        className={cn(
          "text-sm leading-relaxed text-[var(--text-dark)]",
          scroll && "overflow-auto"
        )}
        style={scroll ? { maxHeight } : undefined}
      >
        {isDataMode ? (
          pre ? (
            <pre className="whitespace-pre-wrap font-mono text-[13px] leading-snug">
              {formatContent(content)}
            </pre>
          ) : (
            formatContent(content)
          )
        ) : (
          children
        )}
      </div>
    </section>
  );
}
