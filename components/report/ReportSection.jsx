"use client";

import React from "react";

/* ---------------------------------------------------------
   Mini utility fn
--------------------------------------------------------- */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* =====================================================
   REPORT SECTION
   - document / verhaal
   - GEEN card
   - GEEN border
===================================================== */

export default function ReportSection({
  title,
  children,
  className,
}) {
  if (!children) return null;

  return (
    <section
      className={cn(
        `
        w-full
        max-w-3xl
        mx-auto
        py-6
        `,
        className
      )}
    >
      {title && (
        <h2 className="mb-3 text-lg font-semibold tracking-tight text-[var(--text-dark)]">
          {title}
        </h2>
      )}

      <div className="text-sm leading-relaxed text-[var(--text-dark)]">
        {children}
      </div>
    </section>
  );
}
