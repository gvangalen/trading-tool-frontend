"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { SlidersHorizontal, Pencil } from "lucide-react";

/**
 * BotRules
 * ----------------------------------------
 * - Toont huidige rules van actieve bot
 * - Geen state
 * - Geen backend
 * - Edit knop wordt afgehandeld door parent
 */
export default function BotRules({
  rules = [],
  loading = false,
  onEdit, // 👈 callback vanuit BotPage
}) {
  const hasRules = Array.isArray(rules) && rules.length > 0;

  return (
    <CardWrapper
      title="Bot Rules"
      icon={<SlidersHorizontal className="icon" />}
      action={
        <button
          className="btn-icon"
          onClick={onEdit}
          title="Rules bewerken"
        >
          <Pencil size={16} />
        </button>
      }
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && <CardLoader text="Rules laden…" />}

      {/* ===================== */}
      {/* EMPTY STATE */}
      {/* ===================== */}
      {!loading && !hasRules && (
        <p className="text-sm text-[var(--text-muted)]">
          Geen regels geconfigureerd voor deze bot.
        </p>
      )}

      {/* ===================== */}
      {/* RULES LIST */}
      {/* ===================== */}
      {!loading && hasRules && (
        <div className="space-y-3 text-sm">
          {rules.map((r, i) => {
            // Ondersteunt meerdere rule structuren
            const ruleText =
              typeof r === "string"
                ? r
                : r.name || r.rule || r.condition || "—";

            const actionText =
              typeof r === "string"
                ? ""
                : r.action || r.result || "";

            const enabled =
              typeof r === "object" ? r.enabled !== false : true;

            return (
              <div
                key={i}
                className="
                  flex justify-between items-center
                  border-b border-[var(--border)]
                  pb-2 last:border-0
                "
              >
                <div className="flex items-center gap-2">
                  <span
                    className={
                      enabled
                        ? ""
                        : "line-through text-[var(--text-muted)]"
                    }
                  >
                    {ruleText}
                  </span>
                </div>

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
