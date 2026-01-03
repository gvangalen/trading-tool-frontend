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
        typeof item === "string"
          ? `- ${item}`
          : `- ${JSON.stringify(item, null, 2)}`
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
   REPORT CARD — DEFINITIEF
===================================================== */

export default function ReportCard({
  title,
  icon = null,

  /** DATA-modus */
  content,
  pre = false,

  /** UI-modus */
  children,

  full = false,
}) {
  const isDataMode = content !== undefined;

  return (
    <section
      className={cn(
        `
        w-full
        bg-white
        border border-gray-200
        rounded-xl
        shadow-sm
        p-5
        `,
        full && "md:col-span-2"
      )}
    >
      {/* Header */}
      {(title || icon) && (
        <header className="mb-3 flex items-center gap-2">
          {icon && (
            <span className="text-gray-500">{icon}</span>
          )}
          {title && (
            <h2 className="text-base font-semibold tracking-tight text-[var(--text-dark)]">
              {title}
            </h2>
          )}
        </header>
      )}

      {/* Content */}
      <div className="text-sm leading-relaxed text-[var(--text-dark)]">
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
