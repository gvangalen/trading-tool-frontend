"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { SlidersHorizontal } from "lucide-react";

export default function BotRules({
  rules = [],
  loading = false,
}) {
  const hasRules = Array.isArray(rules) && rules.length > 0;

  return (
    <CardWrapper
      title="Bot Rules"
      icon={<SlidersHorizontal className="icon" />}
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && (
        <CardLoader text="Rules laden…" />
      )}

      {/* ===================== */}
      {/* EMPTY STATE */}
      {/* ===================== */}
      {!loading && !hasRules && (
        <p className="text-sm text-[var(--text-muted)]">
          Geen regels geconfigureerd voor deze bot.
        </p>
      )}

      {/* ===================== */}
      {/* RULES */}
      {/* ===================== */}
      {!loading && hasRules && (
        <div className="space-y-3 text-sm">
          {rules.map((r, i) => {
            // Ondersteun meerdere rule-structuren
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
                className="
                  flex justify-between items-center
                  border-b border-[var(--border)]
                  pb-2 last:border-0
                "
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
