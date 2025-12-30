"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { SlidersHorizontal, Loader2 } from "lucide-react";

export default function BotRules({
  rules = [],
  loading = false,
}) {
  return (
    <CardWrapper
      title="Bot Rules"
      icon={<SlidersHorizontal className="icon" />}
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && (
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Rules laden…</span>
        </div>
      )}

      {/* ===================== */}
      {/* EMPTY STATE */}
      {/* ===================== */}
      {!loading && (!rules || rules.length === 0) && (
        <p className="text-sm text-[var(--text-muted)]">
          Geen regels geconfigureerd voor deze bot.
        </p>
      )}

      {/* ===================== */}
      {/* RULES */}
      {/* ===================== */}
      {!loading && rules && rules.length > 0 && (
        <div className="space-y-3 text-sm">
          {rules.map((r, i) => {
            // Support verschillende structuren
            const ruleText =
              typeof r === "string"
                ? r
                : r.rule || r.condition || "—";

            const actionText =
              typeof r === "string"
                ? ""
                : r.action || r.result || "—";

            return (
              <div
                key={i}
                className="flex justify-between items-center border-b border-[var(--border)] pb-2 last:border-0"
              >
                <span>{ruleText}</span>
                {actionText && (
                  <span className="font-medium">
                    {actionText}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </CardWrapper>
  );
}
