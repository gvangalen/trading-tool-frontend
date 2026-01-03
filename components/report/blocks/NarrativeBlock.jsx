"use client";

import ReportCard from "../ReportCard";
import { FileText } from "lucide-react";

/* =====================================================
   HELPERS — robuuste normalisatie
===================================================== */

function normalizeText(input) {
  if (input === null || input === undefined) return null;

  // string → direct
  if (typeof input === "string") {
    const t = input.trim();
    return t.length > 0 ? t : null;
  }

  // number / boolean → string
  if (typeof input === "number" || typeof input === "boolean") {
    return String(input);
  }

  // array → paragrafen
  if (Array.isArray(input)) {
    const lines = input
      .map((v) => normalizeText(v))
      .filter(Boolean);

    return lines.length ? lines.join("\n\n") : null;
  }

  // object (jsonb / AI)
  if (typeof input === "object") {
    // bekende tekstvelden eerst
    if (input.text) return normalizeText(input.text);
    if (input.summary) return normalizeText(input.summary);
    if (input.description) return normalizeText(input.description);
    if (input.content) return normalizeText(input.content);

    if (input.bullets) return normalizeText(input.bullets);
    if (input.points) return normalizeText(input.points);
    if (input.items) return normalizeText(input.items);

    // fallback → leesbaar stringify
    try {
      const s = JSON.stringify(input, null, 2);
      return s && s.trim().length ? s : null;
    } catch {
      return null;
    }
  }

  return null;
}

/* =====================================================
   Resolver — expliciet > field > niets
===================================================== */

function resolveText({ text, field, report }) {
  const direct = normalizeText(text);
  if (direct) return direct;

  if (field && report && typeof report === "object") {
    return normalizeText(report[field]);
  }

  return null;
}

/* =====================================================
   NarrativeBlock — v2.0
   ✔ leest als analyse
   ✔ geen log-dump
   ✔ card blijft visueel rustig
===================================================== */

export default function NarrativeBlock({
  title,
  text,
  field,
  report,
  icon,
}) {
  const content = resolveText({ text, field, report });
  if (!content) return null;

  // splits paragrafen (1 lege regel = nieuwe alinea)
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <ReportCard
      icon={icon || <FileText size={18} />}
      title={title}
    >
      <div className="space-y-3 text-sm leading-relaxed text-[var(--text-dark)]">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </ReportCard>
  );
}
