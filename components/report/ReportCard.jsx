"use client";

import React from "react";

/* ---------------------------------------------------------
   Mini utility fn → vervangt clsx / cn / tailwind-merge
--------------------------------------------------------- */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ---------------------------------------------------------
   🔎 Content formatter (jsonb-aware)
   ❗ Alleen voor DATA — nooit voor JSX
--------------------------------------------------------- */
function formatContent(value) {
  if (value === null || value === undefined) return "–";

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    if (value.length === 0) return "–";
    return value
      .map((item) => {
        if (typeof item === "string") return `- ${item}`;
        if (typeof item === "object")
          return `- ${JSON.stringify(item, null, 2)}`;
        return `- ${String(item)}`;
      })
      .join("\n");
  }

  if (typeof value === "object") {
    if (value.text) return value.text;

    if (value.comment || value.recommendation) {
      return [value.comment, value.recommendation]
        .filter(Boolean)
        .join("\n\n");
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

/* =====================================================
   REPORT CARD — DASHBOARD BASE
   ✔ lichte border
   ✔ zachte shadow
   ✔ padding
   ✔ afgeronde hoeken
   ❌ geen kleuren
===================================================== */

export default function ReportCard({
  title,
  content,
  children,
  icon = null,
  pre = false,
  full = false,
}) {
  const hasJSXChildren = React.isValidElement(children);
  const resolvedContent =
    children !== undefined && children !== null ? children : content;

  const shouldFormat =
    !hasJSXChildren &&
    typeof resolvedContent !== "function";

  const renderedContent = shouldFormat
    ? formatContent(resolvedContent)
    : resolvedContent;

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
      {/* Titel */}
      <header className="mb-3 flex items-center gap-2">
        {icon && (
          <span className="inline-flex items-center justify-center text-gray-500">
            {icon}
          </span>
        )}
        <h2 className="text-base font-semibold tracking-tight text-[var(--text-dark)]">
          {title}
        </h2>
      </header>

      {/* Content */}
      <div className="text-sm leading-relaxed text-[var(--text-dark)] whitespace-pre-wrap">
        {pre && shouldFormat ? (
          <pre
            className="
              font-mono text-[13px] leading-snug
              bg-transparent
              p-0
              m-0
              whitespace-pre-wrap
            "
          >
            {renderedContent}
          </pre>
        ) : (
          renderedContent
        )}
      </div>
    </section>
  );
}
